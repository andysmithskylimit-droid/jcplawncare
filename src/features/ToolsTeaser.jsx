import { tools } from '../data/content';
import { Link } from '../lib/router';
import RevealText from '../components/RevealText';

function ToolIcon({ kind }) {
  if (kind === 'doctor')
    return (
      <svg viewBox="0 0 160 100" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={10 + i * 14} y="14" width="14" height="72" className={i % 2 ? 'ti-dark' : 'ti-light'} />
        ))}
        <circle cx="66" cy="44" r="10" className="ti-spot" />
        <circle cx="104" cy="54" r="24" className="ti-lens" />
        <line x1="121" y1="71" x2="146" y2="94" className="ti-handle" />
      </svg>
    );
  if (kind === 'scope')
    return (
      <svg viewBox="0 0 160 100" aria-hidden="true">
        <rect x="40" y="8" width="80" height="88" rx="6" className="ti-board" />
        <rect x="64" y="2" width="32" height="14" rx="4" className="ti-clip" />
        {[30, 48, 66].map((y, i) => (
          <g key={y}>
            <rect x="52" y={y} width="10" height="10" rx="2" className={i < 2 ? 'ti-tick' : 'ti-box'} />
            <line x1="70" y1={y + 5} x2="108" y2={y + 5} className="ti-line" />
          </g>
        ))}
      </svg>
    );
  return (
    <svg viewBox="0 0 160 100" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={10 + i * 14} y="14" width="14" height="72" className={i % 2 ? 'ti-dark' : 'ti-light'} />
      ))}
      <path d="M80 20c-12 0-21 9-21 21 0 16 21 37 21 37s21-21 21-37c0-12-9-21-21-21z" className="ti-pin" />
      <circle cx="80" cy="41" r="7" className="ti-pin-dot" />
    </svg>
  );
}

export default function ToolsTeaser() {
  return (
    <section className="tools section" aria-labelledby="tools-title">
      <div className="container">
        <div className="section-head">
          <RevealText className="section-title" id="tools-title">
            Plan your lawn care in two minutes.
          </RevealText>
          <p className="section-intro">Three quick tools to work out what your property needs before you call.</p>
        </div>
        <ul className="tools__grid">
          {tools.map((t) => (
            <li key={t.to}>
              <Link to={t.to} className="tool-card" data-cursor="Open">
                <span className="tool-card__art">
                  <ToolIcon kind={t.art} />
                </span>
                <span className="tool-card__title">{t.title}</span>
                <span className="tool-card__text">{t.text}</span>
                <span className="tool-card__action">{t.action}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
