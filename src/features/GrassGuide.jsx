import { useState } from 'react';
import { grassTypes, tips } from '../data/content';
import RevealText from '../components/RevealText';

const FRAC = { 0.25: '¼', 0.5: '½', 0.75: '¾' };
const fmt = (n) => {
  const whole = Math.floor(n);
  const f = FRAC[Math.round((n - whole) * 100) / 100] || '';
  return whole ? `${whole}${f}` : f || '0';
};
const BASE = 262;
const PX = 46; // pixels per inch in the drawing
const Y = (inch) => BASE - inch * PX;
const BLADES = Array.from({ length: 22 }).map((_, i) => ({ x: 92 + i * 12.5, h: 4.55 + ((i * 37) % 9) * 0.05, lean: ((i * 53) % 7) - 3 }));

export function GrassGuide() {
  const [id, setId] = useState(grassTypes[0].id);
  const g = grassTypes.find((x) => x.id === id);
  const [lo, hi] = g.range;
  const mid = (lo + hi) / 2;

  return (
    <section className="grass section" id="grass" aria-labelledby="grass-title">
      <div className="container">
        <div className="section-head">
          <RevealText className="section-title" id="grass-title">
            Know your grass, know your height.
          </RevealText>
          <p className="section-intro">
            The right mowing height depends on the grass. Pick yours to see its typical range and how it behaves here.
          </p>
        </div>

        <div className="grass__tabs" role="group" aria-label="Grass type">
          {grassTypes.map((t) => (
            <button key={t.id} type="button" aria-pressed={id === t.id} className={`seasons__tab ${id === t.id ? 'is-active' : ''}`} onClick={() => setId(t.id)}>
              {t.name}
            </button>
          ))}
        </div>

        <div className="grass__body">
          <svg className="ruler" viewBox="0 0 400 290" role="img" aria-label={`${g.name}: typical mowing height ${fmt(lo)} to ${fmt(hi)} inches`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <g key={i}>
                <line x1="38" x2="62" y1={Y(i)} y2={Y(i)} className="ruler__major" />
                <text x="30" y={Y(i) + 5} className="ruler__num">
                  {i}
                </text>
                {i < 5 && <line x1="48" x2="62" y1={Y(i + 0.5)} y2={Y(i + 0.5)} className="ruler__minor" />}
              </g>
            ))}
            <line x1="62" x2="62" y1={Y(5)} y2={BASE} className="ruler__spine" />
            <text x="8" y="16" className="ruler__unit">
              inches
            </text>
            <rect
              className="ruler__band"
              x="70"
              y={Y(5)}
              width="320"
              height={5 * PX}
              style={{ transform: `translateY(${(5 - hi) * PX}px) scaleY(${(hi - lo) / 5})` }}
            />
            <g className="ruler__blades" style={{ transform: `scaleY(${mid / 5})` }}>
              {BLADES.map((b, i) => (
                <path
                  key={i}
                  d={`M${b.x} ${BASE} C ${b.x + 1} ${BASE - 80} ${b.x + 3} ${Y(b.h) + 40} ${b.x + 5 + b.lean} ${Y(b.h * 1.0)} C ${b.x + 7} ${Y(b.h) + 50} ${b.x + 9} ${BASE - 80} ${b.x + 10} ${BASE} Z`}
                  className={i % 2 ? 'blade blade--dark' : 'blade'}
                />
              ))}
            </g>
            <line x1="70" x2="390" y1={BASE} y2={BASE} className="ruler__ground" />
          </svg>

          <div className="grass__info" aria-live="polite">
            <p className="grass__kind">{g.kind}</p>
            <h3 className="grass__name">{g.name}</h3>
            <p className="grass__height">
              Typical mowing height: <strong>{fmt(lo)} to {fmt(hi)} inches</strong>
            </p>
            <dl className="grass__facts">
              <div>
                <dt>Through the year</dt>
                <dd>{g.look}</dd>
              </div>
              <div>
                <dt>How it spreads</dt>
                <dd>{g.spread}</dd>
              </div>
              <div>
                <dt>Our tip</dt>
                <dd>{g.tip}</dd>
              </div>
            </dl>
            <p className="grass__note">Typical ranges. The right height depends on the variety, the season and the mower.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Tips() {
  return (
    <section className="tips section" aria-labelledby="tips-title">
      <div className="container">
        <div className="section-head">
          <RevealText className="section-title section-title--light" id="tips-title">
            Four rules that fix most lawns.
          </RevealText>
          <p className="section-intro section-intro--light">Simple habits that do more for a lawn than any product on the shelf.</p>
        </div>
        <ul className="tips__grid">
          {tips.map((t) => (
            <li className="tip" key={t.title}>
              <h3 className="tip__title">{t.title}</h3>
              <p className="tip__text">{t.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
