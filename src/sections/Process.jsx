import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { company, process } from '../data/content';
import RevealText from '../components/RevealText';

/** A real sequence, so it gets numbers. A mower track fills down the steps as you read. */
export default function Process({ title = 'How it works', intro = 'From the first call to a regular schedule, in four steps.', steps = process, id = 'process' }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray('.step');
      if (prefersReducedMotion) {
        steps.forEach((s) => s.classList.add('is-on'));
        return;
      }
      gsap.fromTo(
        '.process__fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.process__steps', start: 'top 62%', end: 'bottom 62%', scrub: 0.4 },
        }
      );
      steps.forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 62%',
          onEnter: () => step.classList.add('is-on'),
          onLeaveBack: () => step.classList.remove('is-on'),
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="process section" id={id} ref={ref} aria-labelledby={`${id}-title`}>
      <div className="container process__grid">
        <div className="process__intro">
          <RevealText className="section-title" id={`${id}-title`}>
            {title}
          </RevealText>
          <p className="section-intro">{intro}</p>
          <a className="process__call" href={company.phoneHref} data-cursor="Call">
            {company.phoneDisplay}
          </a>
        </div>

        <div className="process__steps">
          <span className="process__rail" aria-hidden="true">
            <span className="process__fill" />
          </span>
          <ol className="process__list">
          {steps.map((s, i) => (
            <li className="step" key={s.title}>
              <span className="step__num" aria-hidden="true">
                {i + 1}
              </span>
              <div className="step__body">
                <h3 className="step__title">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h3>
                <p className="step__text">{s.body}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
