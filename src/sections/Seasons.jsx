import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { seasons } from '../data/content';
import RevealText from '../components/RevealText';

const arcPath = (peak) => `M20 200 Q200 ${peak} 380 200`;
const sunY = (peak) => 0.25 * 200 + 0.5 * peak + 0.25 * 200;

function SunArc() {
  return (
    <svg className="season-art" viewBox="0 0 400 240" aria-hidden="true">
      <line x1="0" y1="200" x2="400" y2="200" className="season-art__horizon" />
      <path className="season-art__arc" d={arcPath(seasons[0].arcPeak)} />
      <circle className="season-art__sun" cx="200" cy={sunY(seasons[0].arcPeak)} r="16" />
      <g className="season-art__rain">
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={i} x1={40 + i * 24} y1={40 + (i % 3) * 18} x2={34 + i * 24} y2={58 + (i % 3) * 18} />
        ))}
      </g>
      <g className="season-art__leaves">
        {Array.from({ length: 9 }).map((_, i) => (
          <ellipse key={i} cx={60 + i * 34} cy={120 + (i % 3) * 22} rx="6" ry="3" transform={`rotate(${i * 40} ${60 + i * 34} ${120 + (i % 3) * 22})`} />
        ))}
      </g>
      <g className="season-art__grass">
        {Array.from({ length: 40 }).map((_, i) => {
          const x = 10 + i * 9.8;
          const h = 10 + ((i * 7) % 9);
          return <path key={i} d={`M${x} 200 l3 -${h} l3 ${h}`} />;
        })}
      </g>
    </svg>
  );
}

export default function Seasons() {
  const ref = useRef(null);
  const tabRefs = useRef([]);
  const [active, setActive] = useState(0);
  const season = seasons[active];
  const first = useRef(true);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const dur = prefersReducedMotion || first.current ? 0 : 1.1;
      gsap.to('.season-art__arc', { attr: { d: arcPath(season.arcPeak) }, duration: dur, ease: 'power3.inOut' });
      gsap.to('.season-art__sun', { attr: { cy: sunY(season.arcPeak) }, duration: dur, ease: 'power3.inOut' });
      gsap.to('.season-art__rain', { opacity: season.id === 'winter' ? 1 : 0, duration: dur * 0.6 });
      gsap.to('.season-art__leaves', { opacity: season.id === 'fall' ? 1 : 0, duration: dur * 0.6 });
      if (!first.current && !prefersReducedMotion) {
        gsap.fromTo(
          '.season-panel > *',
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.06 }
        );
      }
      first.current = false;
    }, ref);
    return () => ctx.kill && ctx.kill();
  }, [active, season]);

  const onKey = (e) => {
    const n = seasons.length;
    let next = null;
    if (e.key === 'ArrowRight') next = (active + 1) % n;
    if (e.key === 'ArrowLeft') next = (active - 1 + n) % n;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = n - 1;
    if (next !== null) {
      e.preventDefault();
      setActive(next);
      tabRefs.current[next] && tabRefs.current[next].focus();
    }
  };

  return (
    <section className={`seasons section seasons--${season.id}`} id="seasons" ref={ref} aria-labelledby="seasons-title">
      <div className="container">
        <div className="section-head">
          <RevealText className="section-title" id="seasons-title">
            A year of care in the Sacramento Valley
          </RevealText>
          <p className="section-intro">
            Hot, dry summers and wet winters ask different things of a lawn. Here is what we focus on through the year.
          </p>
        </div>

        <div className="seasons__tabs" role="tablist" aria-label="Seasons" onKeyDown={onKey}>
          {seasons.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => (tabRefs.current[i] = el)}
              type="button"
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={active === i}
              aria-controls={`panel-${s.id}`}
              tabIndex={active === i ? 0 : -1}
              className={`seasons__tab ${active === i ? 'is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="seasons__body">
          <div className="seasons__art">
            <SunArc />
          </div>
          <div className="season-panel" role="tabpanel" id={`panel-${season.id}`} aria-labelledby={`tab-${season.id}`} tabIndex={0}>
            <p className="season-panel__months">{season.months}</p>
            <h3 className="season-panel__title">{season.headline}</h3>
            <p className="season-panel__text">{season.body}</p>
            <ul className="season-panel__tasks">
              {season.tasks.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
