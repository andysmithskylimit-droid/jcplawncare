import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { standards } from '../data/content';
import RevealText from '../components/RevealText';

/** The visit checklist. Each line gets ticked as it scrolls into the reading zone. */
export default function Standard() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.check');
      if (prefersReducedMotion) {
        items.forEach((i) => i.classList.add('is-checked'));
        return;
      }
      items.forEach((item) =>
        ScrollTrigger.create({
          trigger: item,
          start: 'top 80%',
          onEnter: () => item.classList.add('is-checked'),
          onLeaveBack: () => item.classList.remove('is-checked'),
        })
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="standard section" ref={ref} aria-labelledby="standard-title">
      <div className="container standard__grid">
        <div className="standard__head">
          <RevealText className="section-title" id="standard-title">
            Every visit ends with the same checklist.
          </RevealText>
          <p className="section-intro">
            This is what "done" means at JCP, whether it is a front yard or a forty-unit complex.
          </p>
        </div>
        <ul className="checklist">
          {standards.map((s) => (
            <li className="check" key={s}>
              <span className="check__box" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1" />
                </svg>
              </span>
              <span className="check__text">{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
