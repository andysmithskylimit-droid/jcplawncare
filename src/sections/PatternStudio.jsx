import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { patterns } from '../data/content';
import RevealText from '../components/RevealText';
import ButtonLabel from '../components/ButtonLabel';
import { requestQuote } from '../lib/quote';
import { buildGrain, paintOvergrown, paintPattern, drawMower, makeCanvas } from '../lib/lawnTextures';

/* ── Component ─────────────────────────────────────────────── */

export default function PatternStudio() {
  const sectionRef = useRef(null);
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const store = useRef({ W: 0, H: 0, scale: 1, noise: null, overgrown: null, cache: {}, under: null, shown: 'overgrown', tween: null, particles: [], last: 0 });
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('Overgrown lawn. Choose a pattern to mow it.');
  const touched = useRef(false);

  const getPattern = (id) => {
    const s = store.current;
    if (!s.cache[id]) s.cache[id] = paintPattern(s.W, s.H, s.scale, s.noise, id);
    return s.cache[id];
  };
  const textureFor = (id) => (id === 'overgrown' ? store.current.overgrown : getPattern(id));

  const drawStatic = (id) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.drawImage(textureFor(id), 0, 0);
  };

  const setup = () => {
    const s = store.current;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return false;
    const cssW = wrap.clientWidth;
    const cssH = wrap.clientHeight;
    if (!cssW || !cssH) return false;
    const scale = Math.min(window.devicePixelRatio || 1, 1.5);
    const W = Math.round(cssW * scale);
    const H = Math.round(cssH * scale);
    if (W === s.W && H === s.H) return true;
    s.tween && s.tween.kill();
    s.W = W;
    s.H = H;
    s.scale = scale;
    canvas.width = W;
    canvas.height = H;
    s.noise = buildGrain(W, H, scale);
    s.overgrown = paintOvergrown(W, H, scale, s.noise);
    s.cache = {};
    s.under = makeCanvas(W, H);
    drawStatic(s.shown);
    return true;
  };

  const mowTo = (id) => {
    const s = store.current;
    if (!setup()) return;
    s.tween && s.tween.kill();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    s.under.getContext('2d').drawImage(canvas, 0, 0);
    const target = textureFor(id);
    const label = patterns.find((p) => p.id === id)?.label || 'Overgrown lawn';

    if (prefersReducedMotion) {
      ctx.drawImage(target, 0, 0);
      s.shown = id;
      setStatus(id === 'overgrown' ? 'Overgrown lawn. Choose a pattern to mow it.' : `${label}, freshly mowed.`);
      return;
    }

    if (id === 'overgrown') {
      const o = { a: 0 };
      setStatus('Letting it grow back…');
      s.tween = gsap.to(o, {
        a: 1,
        duration: 0.9,
        ease: 'power2.inOut',
        onUpdate: () => {
          ctx.globalAlpha = 1;
          ctx.drawImage(s.under, 0, 0);
          ctx.globalAlpha = o.a;
          ctx.drawImage(target, 0, 0);
          ctx.globalAlpha = 1;
        },
        onComplete: () => {
          s.shown = 'overgrown';
          setStatus('Overgrown lawn. Choose a pattern to mow it.');
        },
      });
      return;
    }

    const cols = Math.max(6, Math.min(13, Math.round(s.W / s.scale / 92)));
    const colW = s.W / cols;
    const o = { t: 0 };
    s.particles = [];
    s.last = performance.now();
    setStatus(`Mowing ${label.toLowerCase()}…`);

    s.tween = gsap.to(o, {
      t: cols,
      duration: cols * 0.36,
      ease: 'none',
      onUpdate: () => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - s.last) / 1000);
        s.last = now;
        const i = Math.min(cols - 1, Math.floor(o.t));
        const f = Math.min(1, o.t - i);
        const down = i % 2 === 0;
        const len = f * s.H;

        ctx.drawImage(s.under, 0, 0);
        ctx.save();
        ctx.beginPath();
        if (i > 0) ctx.rect(0, 0, colW * i, s.H);
        if (down) ctx.rect(colW * i, 0, colW + 1, len);
        else ctx.rect(colW * i, s.H - len, colW + 1, len);
        ctx.clip();
        ctx.drawImage(target, 0, 0);
        ctx.restore();

        const mx = colW * i + colW / 2;
        const my = down ? len : s.H - len;

        // Side-discharge clippings
        for (let k = 0; k < 3; k++) {
          s.particles.push({
            x: mx + colW * 0.42,
            y: my - (down ? 1 : -1) * colW * 0.3,
            vx: (60 + Math.random() * 140) * s.scale,
            vy: (Math.random() - 0.5) * 90 * s.scale,
            life: 0.5 + Math.random() * 0.4,
            age: 0,
            r: Math.random() * Math.PI,
          });
        }
        ctx.lineCap = 'round';
        s.particles = s.particles.filter((p) => {
          p.age += dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vx *= 0.93;
          p.vy *= 0.93;
          const a = 1 - p.age / p.life;
          if (a <= 0) return false;
          ctx.strokeStyle = `rgba(190,220,120,${a * 0.8})`;
          ctx.lineWidth = 1.6 * s.scale;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + Math.cos(p.r) * 4 * s.scale, p.y + Math.sin(p.r) * 4 * s.scale);
          ctx.stroke();
          return true;
        });

        drawMower(ctx, mx, my, down ? 1 : -1, colW);
      },
      onComplete: () => {
        ctx.drawImage(target, 0, 0);
        s.shown = id;
        setStatus(`${label}, freshly mowed.`);
      },
    });
  };

  // Build textures once the layout has a size, and rebuild on resize.
  useEffect(() => {
    setup();
    let timer;
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => setup(), 160);
    });
    ro.observe(wrapRef.current);
    return () => {
      clearTimeout(timer);
      ro.disconnect();
      store.current.tween && store.current.tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // First visit: demonstrate with classic stripes, unless the visitor already picked one.
  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: 'top 62%',
      once: true,
      onEnter: () => {
        if (touched.current) return;
        setSelected('stripes');
        mowTo('stripes');
      },
    });
    return () => st.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choose = (id) => {
    touched.current = true;
    setSelected(id);
    mowTo(id);
  };

  const regrow = () => {
    touched.current = true;
    setSelected(null);
    mowTo('overgrown');
  };

  const current = patterns.find((p) => p.id === selected);
  const cycle = () => {
    const idx = patterns.findIndex((p) => p.id === selected);
    choose(patterns[(idx + 1) % patterns.length].id);
  };

  return (
    <section className="patterns section" id="patterns" ref={sectionRef} aria-labelledby="patterns-title">
      <div className="container patterns__grid">
        <div className="patterns__copy">
          <RevealText className="section-title" id="patterns-title">
            Pick a pattern. Watch it get mowed.
          </RevealText>
          <p className="section-intro">
            Stripes come from bending the grass in alternating directions, so light bounces off each pass
            differently. Choose a look for your lawn and mention it with your quote.
          </p>

          <div className="patterns__options" role="group" aria-label="Mowing patterns">
            {patterns.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`pattern-btn ${selected === p.id ? 'is-selected' : ''}`}
                aria-pressed={selected === p.id}
                onClick={() => choose(p.id)}
              >
                <span className={`pattern-btn__swatch pattern-btn__swatch--${p.id}`} aria-hidden="true" />
                <span className="pattern-btn__text">
                  <span className="pattern-btn__label">{p.label}</span>
                  <span className="pattern-btn__note">{p.note}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="patterns__actions">
            <button type="button" className="btn btn--dark" onClick={() =>
                requestQuote({
                  service: 'Mowing & striping',
                  note: current ? `Mowing pattern: ${current.label.toLowerCase()}.` : undefined,
                })
              }>
              <ButtonLabel>{current ? `Quote me for ${current.label.toLowerCase()}` : 'Quote me for striping'}</ButtonLabel>
            </button>
            <button type="button" className="text-btn" onClick={regrow}>
              Let it grow back
            </button>
          </div>
        </div>

        <div className="patterns__stage">
          <div className="patterns__lawn" ref={wrapRef} data-cursor="Mow" onClick={cycle}>
            <canvas ref={canvasRef} className="patterns__canvas" role="img" aria-label={status} />
          </div>
          <p className="patterns__status" aria-live="polite">
            {status}
          </p>
        </div>
      </div>
    </section>
  );
}
