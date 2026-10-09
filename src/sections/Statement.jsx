import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { statement, marqueeItems } from '../data/content';
import Marquee from '../components/Marquee';

/** The manifesto: each word lights up as it passes through the reading line. */
export default function Statement() {
  const ref = useRef(null);
  const words = statement.split(' ');

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.statement__w',
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: '.statement__text', start: 'top 78%', end: 'bottom 52%', scrub: 0.5 },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="statement" ref={ref} aria-label="About JCP Lawn Service">
      <div className="container statement__inner">
        <p className="statement__text">
          {words.map((w, i) => (
            <span className="statement__w" key={i}>
              {w}{' '}
            </span>
          ))}
        </p>
        <p className="statement__sign">
          JCP Lawn Service
          <br />
          Rancho Cordova, California
        </p>
      </div>
      <Marquee items={marqueeItems} />
    </section>
  );
}
