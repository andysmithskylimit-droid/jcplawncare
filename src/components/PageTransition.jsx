import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, startScroll, stopScroll } from '../lib/motion';
import { setTransition } from '../lib/router';
import { findRoute } from '../data/routes';

const PASSES = 8;

/** Between pages the screen is mowed shut in alternating passes, then mowed open on the new page. */
export default function PageTransition() {
  const root = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    setTransition((commit, nextPath) => {
      if (prefersReducedMotion || !root.current) {
        commit();
        return;
      }
      const passes = root.current.querySelectorAll('.pt-pass');
      label.current.textContent = findRoute(nextPath)?.name || '';
      stopScroll();
      gsap
        .timeline({ defaults: { ease: 'power3.inOut' } })
        .set(root.current, { visibility: 'visible' })
        .fromTo(
          passes,
          { scaleY: 0, transformOrigin: (i) => (i % 2 ? '50% 100%' : '50% 0%') },
          { scaleY: 1, duration: 0.55, stagger: 0.045 }
        )
        .fromTo(label.current, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'expo.out' }, '-=0.25')
        .add(() => commit())
        .to(label.current, { yPercent: -110, opacity: 0, duration: 0.35, ease: 'power3.in' }, '+=0.12')
        .to(passes, { scaleY: 0, transformOrigin: (i) => (i % 2 ? '50% 0%' : '50% 100%'), duration: 0.6, stagger: 0.045 }, '-=0.1')
        .set(root.current, { visibility: 'hidden' })
        .add(() => startScroll());
    });
    return () => setTransition(null);
  }, []);

  return (
    <div className="pt" ref={root} aria-hidden="true">
      <div className="pt-passes">
        {Array.from({ length: PASSES }).map((_, i) => (
          <span key={i} className={`pt-pass ${i % 2 ? 'pt-pass--alt' : ''}`} />
        ))}
      </div>
      <div className="pt-label-mask">
        <span className="pt-label" ref={label} />
      </div>
    </div>
  );
}
