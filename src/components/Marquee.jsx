import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';

function Blade() {
  return (
    <svg className="marquee__blade" viewBox="0 0 14 28" aria-hidden="true">
      <path d="M7 0 C8.8 9 10.5 18 12 28 L2 28 C3.5 18 5.2 9 7 0 Z" />
    </svg>
  );
}

/** Endless service ticker that speeds up with scroll velocity. */
export default function Marquee({ items }) {
  const root = useRef(null);
  const track = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const loop = gsap.to(track.current, { xPercent: -50, ease: 'none', duration: 42, repeat: -1 });
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = 1 + Math.min(5, Math.abs(self.getVelocity()) / 350);
          gsap.to(loop, { timeScale: boost, duration: 0.25, overwrite: true });
          gsap.to(loop, { timeScale: 1, duration: 1.4, delay: 0.25, ease: 'power2.out' });
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const row = (key) => (
    <div className="marquee__row" key={key} aria-hidden={key !== 'a'}>
      {items.map((item) => (
        <span className="marquee__item" key={item}>
          {item}
          <Blade />
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee" ref={root}>
      <div className="marquee__track" ref={track}>
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}
