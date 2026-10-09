import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';

const PASSES = 7;

/**
 * Opening sequence: the screen is "mowed" in alternating up and down passes,
 * like a crew striping a lawn, while the wordmark settles in. Then the whole
 * panel lifts away to reveal the hero.
 */
export default function Preloader({ onComplete }) {
  const root = useRef(null);
  const numRef = useRef(null);
  const [gone, setGone] = useState(false);

  useLayoutEffect(() => {
    const fast = prefersReducedMotion;
    const fontsReady = Promise.race([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise((r) => setTimeout(r, 2600)),
    ]);

    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      const exit = () =>
        fontsReady.then(() => {
          gsap
            .timeline({ onComplete: () => setGone(true) })
            .to('.pl-brand-i, .pl-meta', { yPercent: -110, opacity: 0, duration: 0.55, ease: 'power3.in', stagger: 0.05 })
            .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: fast ? 0.3 : 1.15, ease: 'expo.inOut' }, '-=0.1')
            .call(() => onComplete && onComplete(), null, fast ? 0.3 : '-=0.8');
        });

      gsap
        .timeline({ onComplete: exit })
        .to('.pl-pass', { scaleY: 1, duration: fast ? 0.01 : 0.5, ease: 'power2.inOut', stagger: fast ? 0 : 0.17 })
        .to(
          counter,
          {
            v: 100,
            duration: fast ? 0.2 : 1.75,
            ease: 'power1.inOut',
            onUpdate: () => {
              if (numRef.current) numRef.current.textContent = Math.round(counter.v);
            },
          },
          0
        )
        .from('.pl-brand-i', { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0.2);
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="pl-passes">
        {Array.from({ length: PASSES }).map((_, i) => (
          <span key={i} className={`pl-pass ${i % 2 ? 'pl-pass--up' : ''}`} />
        ))}
      </div>
      <div className="pl-brand">
        <span className="pl-brand-mask">
          <span className="pl-brand-i pl-brand-name">JCP</span>
        </span>
        <span className="pl-brand-mask">
          <span className="pl-brand-i pl-brand-sub">Lawn Service</span>
        </span>
      </div>
      <div className="pl-meta">
        <span ref={numRef}>0</span>
        <span className="pl-meta-unit">%</span>
      </div>
    </div>
  );
}
