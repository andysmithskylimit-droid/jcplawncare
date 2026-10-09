import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { visitSteps } from '../data/content';
import RevealText from '../components/RevealText';

/** A real sequence, so it is numbered. A little mower drives the line as you scroll. */
export default function VisitTimeline() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const steps = ref.current.querySelectorAll('.visit__step');
    if (prefersReducedMotion) {
      steps.forEach((s) => s.classList.add('is-on'));
      return;
    }
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '.visit__track-wrap',
            start: 'top 78%',
            end: 'top 28%',
            scrub: 0.5,
            onUpdate: (self) =>
              steps.forEach((s, i) => s.classList.toggle('is-on', self.progress >= i / (steps.length - 1) - 0.02)),
          },
        })
        .fromTo('.visit__fill', { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
        .fromTo('.visit__mower', { left: '0%' }, { left: '100%', ease: 'none' }, 0);
      steps[0] && steps[0].classList.add('is-on');
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="visit section" ref={ref} aria-labelledby="visit-title">
      <div className="container">
        <div className="section-head">
          <RevealText className="section-title section-title--light" id="visit-title">
            What a visit looks like.
          </RevealText>
          <p className="section-intro section-intro--light">
            The same six steps, in the same order, every time we come. That is how a lawn looks the same every week.
          </p>
        </div>
        <div className="visit__track-wrap">
          <div className="visit__track" aria-hidden="true">
            <span className="visit__fill" />
            <span className="visit__mower">
              <svg viewBox="0 0 40 28">
                <rect x="10" y="2" width="26" height="24" rx="4" fill="#e4b842" />
                <circle cx="23" cy="14" r="6" fill="#0e2a18" opacity=".3" />
                <path d="M10 6 L1 9 L1 19 L10 22" stroke="#f3f5ee" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <ol className="visit__steps">
            {visitSteps.map((s, i) => (
              <li className="visit__step" key={s.title}>
                <span className="visit__num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="visit__title">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h3>
                <p className="visit__text">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
