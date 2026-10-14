/* GLSL for the hero lawn. Written in GLSL ES 1.0 style; three.js converts for WebGL2. */

const noise = /* glsl */ `
  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
`;

export const bladeVertex = /* glsl */ `
  uniform float uTime;
  uniform float uCutZ;
  uniform float uStripeW;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uFogNear;
  uniform float uFogFar;

  attribute vec3 aOffset;
  attribute float aScale;
  attribute float aAngle;
  attribute float aRand;

  varying float vH;
  varying float vCut;
  varying float vStripe;
  varying float vRand;
  varying float vFog;
  varying float vEdge;
  varying float vPatch;

  ${noise}

  void main() {
    float h = position.y;
    vPatch = vnoise(aOffset.xz * 0.22 + 3.7);
    vH = h;
    vRand = aRand;

    // Has the mower passed this blade yet? Jitter keeps the cut edge natural.
    float jitter = (aRand - 0.5) * 0.7;
    float cut = smoothstep(uCutZ - 0.25, uCutZ + 0.25, aOffset.z + jitter);
    vCut = cut;
    float stripe = mod(floor((aOffset.x + 1000.0) / uStripeW), 2.0);
    vStripe = stripe;
    vEdge = 1.0 - smoothstep(0.0, 1.6, abs(aOffset.z - uCutZ));

    float dist = max(0.0, 9.0 - aOffset.z);
    float widthScale = (1.0 + dist * 0.032) * mix(1.0, 1.3, cut);

    vec3 p = position;
    p.x *= widthScale;
    p.y *= aScale * mix(1.0, 0.42, cut);
    p.z *= aScale;

    float c = cos(aAngle);
    float s = sin(aAngle);
    p.xz = vec2(c * p.x - s * p.z, s * p.x + c * p.z);

    float hh = h * h;
    float n = vnoise(aOffset.xz * 0.12 + vec2(uTime * 0.28, uTime * 0.11));
    float gust = (n - 0.45) * 0.8;
    float flutter = sin(uTime * 2.1 + aRand * 6.2831 + aOffset.x * 0.4) * 0.06;
    float sway = (gust + flutter) * mix(1.0, 0.25, cut);
    float lean = 0.0; // no striping: mowed blades stand evenly

    p.x += sway * hh * aScale;
    p.z += (sway * 0.4 + lean) * hh * aScale;

    vec3 world = p + aOffset;

    vec2 d = world.xz - uPointer;
    float pd = length(d);
    float push = (1.0 - smoothstep(0.0, 2.2, pd)) * uPointerStrength;
    world.xz += normalize(d + vec2(0.0001)) * push * hh * 0.9;
    world.y -= push * hh * 0.15;

    vec4 mv = modelViewMatrix * vec4(world, 1.0);
    vFog = smoothstep(uFogNear, uFogFar, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

export const bladeFragment = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uTip;
  uniform vec3 uSun;
  uniform vec3 uFog;

  varying float vH;
  varying float vCut;
  varying float vStripe;
  varying float vRand;
  varying float vFog;
  varying float vEdge;
  varying float vPatch;

  void main() {
    vec3 col = mix(uBase, uTip, smoothstep(0.0, 1.0, vH));
    // Backlit tips catch the low sun
    col = mix(col, uSun, pow(vH, 3.0) * 0.22 * (1.0 - vCut * 0.6));
    col *= 0.84 + vRand * 0.28;
    // Gentle large-scale variation so the lawn doesn't look printed
    col *= mix(vec3(0.9, 0.94, 0.88), vec3(1.04, 1.06, 1.0), vPatch);
    // Freshly cut grass reads slightly brighter (no stripe pattern)
    col *= mix(1.0, 1.06, vCut);
    // Fresh-cut highlight right behind the mower line
    col += vec3(0.16, 0.18, 0.05) * vEdge * vCut * vH;
    // Ambient occlusion toward the root
    col *= mix(0.45, 1.0, smoothstep(0.0, 0.45, vH));
    col = mix(col, uFog, vFog);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export const groundVertex = /* glsl */ `
  varying vec3 vWorld;
  varying float vDepth;

  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    vec4 mv = viewMatrix * w;
    vDepth = -mv.z; // linear in view space, so it interpolates correctly across the huge quad
    gl_Position = projectionMatrix * mv;
  }
`;

export const groundFragment = /* glsl */ `
  uniform vec3 uGround;
  uniform vec3 uFog;
  uniform float uCutZ;
  uniform float uStripeW;
  uniform float uFogNear;
  uniform float uFogFar;
  varying vec3 vWorld;
  varying float vDepth;

  void main() {
    float vFog = smoothstep(uFogNear, uFogFar, vDepth);
    float cut = smoothstep(uCutZ - 0.3, uCutZ + 0.3, vWorld.z);
    float stripe = mod(floor((vWorld.x + 1000.0) / uStripeW), 2.0);
    vec3 col = uGround;
    col *= mix(1.0, 1.05, cut);
    col = mix(col, uFog, vFog);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export const clippingVertex = /* glsl */ `
  uniform float uTime;
  uniform float uCutZ;
  uniform float uActive;
  uniform float uPixelRatio;
  uniform float uFogNear;
  uniform float uFogFar;
  attribute vec3 aSeed;
  varying float vAlpha;

  void main() {
    float life = fract(uTime * (0.55 + aSeed.y * 0.5) + aSeed.z);
    float halfW = 3.0 + (9.0 - uCutZ) * 0.66;
    vec3 p;
    p.x = (aSeed.x - 0.5) * 2.0 * halfW;
    p.y = 0.12 + life * (0.9 + aSeed.y * 0.8) - life * life * (1.0 + aSeed.z * 0.6);
    p.z = uCutZ + 0.15 + life * (0.5 + aSeed.z * 1.1);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (34.0 + aSeed.y * 40.0) * uPixelRatio / max(0.5, -mv.z);

    float fog = smoothstep(uFogNear, uFogFar, -mv.z);
    vAlpha = uActive * (1.0 - life) * smoothstep(0.0, 0.12, life) * (1.0 - fog) * 0.85;
  }
`;

export const clippingFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = vAlpha * smoothstep(0.5, 0.15, d);
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

export const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vDir = w.xyz - cameraPosition;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

export const skyFragment = /* glsl */ `
  uniform vec3 uFog;
  uniform vec3 uSkyMid;
  uniform vec3 uSkyTop;
  uniform vec3 uGlow;
  uniform vec3 uSunDir;
  varying vec3 vDir;

  void main() {
    vec3 d = normalize(vDir);
    float e = d.y;
    // Horizon haze matches the fog exactly, so the lawn melts into the sky
    // Monotonic falloff from bright horizon haze to deep evening sky
    vec3 col = mix(uFog, uSkyMid, smoothstep(0.015, 0.2, e));
    col = mix(col, uSkyTop, smoothstep(0.12, 0.42, e));
    float s = max(dot(d, normalize(uSunDir)), 0.0);
    float horizon = smoothstep(-0.08, 0.04, e);
    col += uGlow * (pow(s, 8.0) * 0.4 + pow(s, 120.0) * 1.2) * horizon;
    col += uGlow * 0.12 * (1.0 - smoothstep(0.0, 0.12, abs(e)));
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;
