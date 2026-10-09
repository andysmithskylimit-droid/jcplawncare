import * as THREE from 'three';
import {
  bladeVertex,
  bladeFragment,
  groundVertex,
  groundFragment,
  clippingVertex,
  clippingFragment,
  skyVertex,
  skyFragment,
} from './shaders';

/*
 * A golden-hour lawn of instanced grass blades.
 * Scroll progress (0 → 1) moves a "cut line" from the camera toward the horizon:
 * blades behind the line are shortened, lean in alternating directions and pick up
 * classic two-tone mowing stripes. Clippings spray along the cut line while it moves.
 */

const Z_NEAR = 7.5;
const Z_FAR = -56;
const CUT_START = Z_NEAR + 2.5;
const halfWidthAt = (z) => 3 + (9 - z) * 0.66;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function createBladeGeometry(segments = 4, width = 0.055) {
  const positions = [];
  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const w = width * Math.pow(1 - t, 0.75);
    const curve = t * t * 0.12;
    positions.push(-w, t, curve, w, t, curve);
  }
  positions.push(0, 1, 0.12); // tip

  const indices = [];
  for (let i = 0; i < segments - 1; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const last = (segments - 1) * 2;
  indices.push(last, last + 1, segments * 2);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  return geo;
}

export class LawnScene {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.reduced = !!options.reducedMotion;
    this.onError = options.onError || (() => {});

    const small = Math.min(window.innerWidth, window.innerHeight) < 700;
    const weakCpu = (navigator.hardwareConcurrency || 8) <= 4;
    this.lowPower = small || weakCpu;
    this.bladeCount = options.bladeCount || (this.lowPower ? 34000 : 95000);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.lowPower ? 1.5 : 1.75));
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500);

    // Camera path: low and close at rest, rising to show the finished stripes.
    this.camStart = new THREE.Vector3(0, 1.55, 9.6);
    this.camEnd = new THREE.Vector3(0, 5.2, 8.4);
    this.camIntro = new THREE.Vector3(0, 3.4, 14);
    this.lookStart = new THREE.Vector3(0, 0.55, -2);
    this.lookEnd = new THREE.Vector3(0, -0.6, -8);
    this.lookTmp = new THREE.Vector3();

    this.progress = this.reduced ? 0.55 : 0;
    this.targetProgress = this.progress;
    this.introT = this.reduced ? 1 : 0;
    this.introPlaying = false;
    this.elapsed = 0;
    this.lastTime = performance.now();

    this.pointerNdc = new THREE.Vector2(0, 0);
    this.pointerSmooth = new THREE.Vector2(0, 0);
    this.pointerActive = false;
    this.raycaster = new THREE.Raycaster();
    this.ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.hit = new THREE.Vector3();

    const fogColor = new THREE.Color('#d6b36c');
    this.uniforms = {
      uTime: { value: 0 },
      uCutZ: { value: CUT_START },
      uStripeW: { value: 2.4 },
      uPointer: { value: new THREE.Vector2(0, 200) },
      uPointerStrength: { value: 0 },
      uFogNear: { value: 15 },
      uFogFar: { value: 64 },
      uBase: { value: new THREE.Color('#0a2811') },
      uTip: { value: new THREE.Color('#84b84a') },
      uSun: { value: new THREE.Color('#f2d983') },
      uGround: { value: new THREE.Color('#1f4a1f') },
      uFog: { value: fogColor },
    };
    this.skyUniforms = {
      uFog: this.uniforms.uFog,
      uSkyMid: { value: new THREE.Color('#556246') },
      uSkyTop: { value: new THREE.Color('#0d2118') },
      uGlow: { value: new THREE.Color('#ffd889') },
      uSunDir: { value: new THREE.Vector3(0.42, 0.05, -1).normalize() },
    };
    this.clipUniforms = {
      uTime: this.uniforms.uTime,
      uCutZ: this.uniforms.uCutZ,
      uActive: { value: 0 },
      uPixelRatio: { value: this.renderer.getPixelRatio() },
      uFogNear: this.uniforms.uFogNear,
      uFogFar: this.uniforms.uFogFar,
      uColor: { value: new THREE.Color('#c9e27e') },
    };

    this._build();
    this.needsRender = true;

    this._onContextLost = (e) => {
      e.preventDefault();
      this.stop();
      this.onError(new Error('WebGL context lost'));
    };
    canvas.addEventListener('webglcontextlost', this._onContextLost);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement || canvas);
    this.resize();
  }

  _build() {
    // Sky dome: the horizon is computed from view direction, so it always lines up with the lawn's fog.
    const skyGeo = new THREE.SphereGeometry(300, 48, 24);
    this.skyMat = new THREE.ShaderMaterial({
      uniforms: this.skyUniforms,
      vertexShader: skyVertex,
      fragmentShader: skyFragment,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
    });
    this.sky = new THREE.Mesh(skyGeo, this.skyMat);
    this.sky.renderOrder = -1;
    this.sky.frustumCulled = false;
    this.scene.add(this.sky);

    // Ground under the blades, so gaps read as soil-dark turf rather than sky.
    const groundGeo = new THREE.PlaneGeometry(600, 420, 1, 1);
    groundGeo.rotateX(-Math.PI / 2);
    groundGeo.translate(0, 0, -190);
    this.groundMat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: groundVertex,
      fragmentShader: groundFragment,
    });
    this.groundMesh = new THREE.Mesh(groundGeo, this.groundMat);
    this.scene.add(this.groundMesh);

    // Instanced blades
    const blade = createBladeGeometry();
    const geo = new THREE.InstancedBufferGeometry();
    geo.setIndex(blade.getIndex());
    geo.setAttribute('position', blade.getAttribute('position'));

    const n = this.bladeCount;
    const offsets = new Float32Array(n * 3);
    const scales = new Float32Array(n);
    const angles = new Float32Array(n);
    const rands = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const t = Math.pow(Math.random(), 1.75); // denser near the camera
      const z = Z_NEAR - (Z_NEAR - Z_FAR) * t;
      const x = (Math.random() * 2 - 1) * halfWidthAt(z);
      offsets[i * 3] = x;
      offsets[i * 3 + 1] = 0;
      offsets[i * 3 + 2] = z;
      scales[i] = 0.34 + Math.random() * 0.26 + t * 0.3;
      angles[i] = Math.random() * Math.PI * 2;
      rands[i] = Math.random();
    }
    geo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3));
    geo.setAttribute('aScale', new THREE.InstancedBufferAttribute(scales, 1));
    geo.setAttribute('aAngle', new THREE.InstancedBufferAttribute(angles, 1));
    geo.setAttribute('aRand', new THREE.InstancedBufferAttribute(rands, 1));
    geo.instanceCount = n;
    this.bladeBase = blade;

    this.bladeMat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: bladeVertex,
      fragmentShader: bladeFragment,
      side: THREE.DoubleSide,
    });
    this.blades = new THREE.Mesh(geo, this.bladeMat);
    this.blades.frustumCulled = false;
    this.scene.add(this.blades);

    // Clippings thrown up along the cut line
    const clipCount = this.lowPower ? 420 : 900;
    const seeds = new Float32Array(clipCount * 3);
    for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
    const clipGeo = new THREE.BufferGeometry();
    clipGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(clipCount * 3), 3));
    clipGeo.setAttribute('aSeed', new THREE.Float32BufferAttribute(seeds, 3));
    this.clipMat = new THREE.ShaderMaterial({
      uniforms: this.clipUniforms,
      vertexShader: clippingVertex,
      fragmentShader: clippingFragment,
      transparent: true,
      depthWrite: false,
    });
    this.clippings = new THREE.Points(clipGeo, this.clipMat);
    this.clippings.frustumCulled = false;
    this.scene.add(this.clippings);
  }

  resize() {
    const host = this.canvas.parentElement || this.canvas;
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    this.camera.aspect = aspect;
    this.camera.fov = aspect < 0.8 ? 54 : aspect < 1.2 ? 46 : 40;
    this.camera.updateProjectionMatrix();
    this.needsRender = true;
  }

  /** 0 → 1 scroll progress through the pinned hero. */
  setProgress(p) {
    this.targetProgress = clamp(p, 0, 1);
    this.needsRender = true;
  }

  /** Pointer in normalized device coordinates (-1 → 1). */
  setPointer(x, y) {
    this.pointerNdc.set(x, y);
    this.pointerActive = true;
    this.needsRender = true;
  }

  clearPointer() {
    this.pointerActive = false;
    this.needsRender = true;
  }

  playIntro() {
    if (this.reduced) return;
    this.introT = 0;
    this.introPlaying = true;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    const loop = () => {
      if (!this.running) return;
      this._tick();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  _tick() {
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    const animating = !this.reduced;
    if (!animating && !this.needsRender && !this.pointerActive) return;

    if (animating) this.elapsed += dt;
    this.uniforms.uTime.value = this.elapsed;

    // Frame-rate independent smoothing toward the scroll target
    const k = 1 - Math.exp(-dt * 5.5);
    this.progress += (this.targetProgress - this.progress) * (this.reduced ? 1 : k);
    const p = this.progress;

    if (this.introPlaying) {
      this.introT = Math.min(1, this.introT + dt / 2.6);
      if (this.introT >= 1) this.introPlaying = false;
    }

    // Mowing line
    const cutP = clamp((p - 0.06) / 0.82, 0, 1);
    const eased = smooth(0, 1, cutP);
    this.uniforms.uCutZ.value = CUT_START - (CUT_START - Z_FAR) * Math.pow(eased, 1.35);
    this.clipUniforms.uActive.value = smooth(0.0, 0.05, cutP) * (1 - smooth(0.86, 1, cutP));

    // Pointer pushes the grass aside
    this.pointerSmooth.lerp(this.pointerNdc, 1 - Math.exp(-dt * 8));
    const targetStrength = this.pointerActive ? 1 : 0;
    this.uniforms.uPointerStrength.value += (targetStrength - this.uniforms.uPointerStrength.value) * (1 - Math.exp(-dt * 4));

    // Camera
    const cp = smooth(0, 1, p);
    const intro = easeOutCubic(this.introT);
    const cam = this.camera.position;
    cam.copy(this.camStart).lerp(this.camEnd, cp);
    cam.lerp(this.camIntro, 1 - intro);
    cam.x += this.pointerSmooth.x * 0.45;
    cam.y += this.pointerSmooth.y * 0.18;
    this.lookTmp.copy(this.lookStart).lerp(this.lookEnd, cp);
    this.camera.lookAt(this.lookTmp);
    this.camera.updateMatrixWorld();
    this.sky.position.copy(cam);

    if (this.uniforms.uPointerStrength.value > 0.001) {
      this.raycaster.setFromCamera(this.pointerSmooth, this.camera);
      if (this.raycaster.ray.intersectPlane(this.ground, this.hit)) {
        this.uniforms.uPointer.value.set(this.hit.x, this.hit.z);
      }
    }

    this.renderer.render(this.scene, this.camera);
    this.needsRender = Math.abs(this.targetProgress - this.progress) > 0.0005 || this.introPlaying;
  }

  dispose() {
    this.stop();
    this.resizeObserver && this.resizeObserver.disconnect();
    this.canvas.removeEventListener('webglcontextlost', this._onContextLost);
    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
    this.bladeBase && this.bladeBase.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
