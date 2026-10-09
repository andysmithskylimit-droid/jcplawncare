import { useLayoutEffect, useRef } from 'react';
import { ScrollTrigger, gsap } from '../lib/motion';
import { audiences } from '../data/content';
import RevealText from '../components/RevealText';
import ButtonLabel from '../components/ButtonLabel';
import { HomePlan, SitePlan } from '../components/PlanArt';
import { requestQuote } from '../lib/quote';
import { Link } from '../lib/router';

function Panel({ data, art, tone }) {
  return (
    <article className={`aud aud--${tone}`} id={data.id} aria-labelledby={`${data.id}-title`}>
      <div className="aud__art">{art}</div>
      <div className="aud__body">
        <p className="aud__label">{data.label}</p>
        <h3 className="aud__title" id={`${data.id}-title`}>
          {data.title}
        </h3>
        {data.builtFor && (
          <ul className="aud__tags" aria-label="Property types">
            {data.builtFor.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        <ul className="aud__points">
          {data.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <div className="aud__actions">
          <Link to={data.to} className={`btn ${tone === 'dark' ? 'btn--gold' : 'btn--dark'}`}>
            <ButtonLabel>{data.cta}</ButtonLabel>
          </Link>
          <button type="button" className={`text-btn ${tone === 'dark' ? 'text-btn--light' : ''}`} onClick={() => requestQuote({ propertyType: data.propertyType })}>
            Get a quote
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Audiences() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.aud').forEach((panel) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 72%',
          once: true,
          onEnter: () => panel.classList.add('is-drawn'),
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="audiences section" id="audiences" ref={ref} aria-labelledby="audiences-title">
      <div className="container">
        <div className="section-head">
          <RevealText className="section-title" id="audiences-title">
            {audiences.heading}
          </RevealText>
          <p className="section-intro">{audiences.intro}</p>
        </div>
        <div className="aud-grid">
          <Panel data={audiences.homes} art={<HomePlan />} tone="light" />
          <Panel data={audiences.commercial} art={<SitePlan />} tone="dark" />
        </div>
      </div>
    </section>
  );
}
