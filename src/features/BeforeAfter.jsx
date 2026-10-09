import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { buildGrain, paintOvergrown, paintPattern } from '../lib/lawnTextures';
import RevealText from '../components/RevealText';

/** Drag to compare an overgrown lawn with the same lawn mowed, edged and striped. */
export default function BeforeAfter() {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const store = useRef({ W: 0, H: 0 });
  const posRef = useRef(62);
  const [pos, setPos] = useState(62);

  const draw = (p) => {
    const s = store.current;
    if (!s.after || !canvas.current) return;
    const ctx = canvas.current.getContext('2d');
    ctx.drawImage(s.after, 0, 0);
    const x = Math.round((s.W * p) / 100);
    if (x > 0) ctx.drawImage(s.before, 0, 0, x, s.H, 0, 0, x, s.H);
  };

  const setup = () => {
    const el = wrap.current;
    if (!el || !el.clientWidth) return;
    const scale = Math.min(window.devicePixelRatio || 1, 1.5);
    const W = Math.round(el.clientWidth * scale);
    const H = Math.round(el.clientHeight * scale);
    if (W === store.current.W && H === store.current.H) return;
    canvas.current.width = W;
    canvas.current.height = H;
    const noise = buildGrain(W, H, scale);
    store.current = { W, H, before: paintOvergrown(W, H, scale, noise), after: paintPattern(W, H, scale, noise, 'stripes') };
    draw(posRef.current);
  };

  useEffect(() => {
    setup();
    let t;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(setup, 160);
    });
    ro.observe(wrap.current);
    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        if (prefersReducedMotion) return;
        const o = { v: 88 };
        gsap.fromTo(o, { v: 88 }, { v: 45, duration: 1.8, ease: 'power3.inOut', onUpdate: () => setPos(Math.round(o.v)) });
      },
    });
    return () => {
      clearTimeout(t);
      ro.disconnect();
      st.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    posRef.current = pos;
    draw(pos);
  }, [pos]);

  return (
    <section className="ba section" aria-labelledby="ba-title">
      <div className="container ba__grid">
        <div className="ba__copy">
          <RevealText className="section-title" id="ba-title">
            The difference one visit makes.
          </RevealText>
          <p className="section-intro">
            Drag the handle to compare an overgrown lawn with the same lawn after a mow, edge and stripe.
          </p>
          <p className="ba__note">Illustrated example.</p>
        </div>
        <div className="ba__frame" ref={wrap}>
          <canvas ref={canvas} className="ba__canvas" aria-hidden="true" />
          <span className="ba__tag ba__tag--before" aria-hidden="true">
            Before
          </span>
          <span className="ba__tag ba__tag--after" aria-hidden="true">
            After
          </span>
          <span className="ba__handle" style={{ left: `${pos}%` }} aria-hidden="true">
            <span className="ba__knob" />
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            className="ba__range"
            aria-label="Before and after comparison. Higher values show more of the overgrown lawn."
            data-cursor="Drag"
          />
        </div>
      </div>
    </section>
  );
}
