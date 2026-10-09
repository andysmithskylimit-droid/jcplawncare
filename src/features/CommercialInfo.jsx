import { propertyTypes, commercialBenefits } from '../data/content';
import RevealText from '../components/RevealText';

/* Small plan-view icons, one per property type */
function TypeIcon({ i }) {
  const common = { viewBox: '0 0 120 80', 'aria-hidden': true };
  const lawn = (x, y, w, h) => (
    <g>
      {Array.from({ length: Math.max(1, Math.round(w / 8)) }).map((_, k) => (
        <rect key={k} x={x + k * 8} y={y} width="8.3" height={h} className={k % 2 ? 'pi-dark' : 'pi-light'} />
      ))}
    </g>
  );
  const icons = [
    <svg {...common}>{lawn(6, 6, 40, 68)}<rect x="54" y="8" width="58" height="34" className="pi-bldg" />{[60, 72, 84, 96].map((x) => <line key={x} x1={x} y1="52" x2={x} y2="70" className="pi-line" />)}</svg>,
    <svg {...common}><rect x="6" y="8" width="108" height="22" className="pi-bldg" />{[14, 28, 42, 56, 70, 84, 98].map((x) => <line key={x} x1={x} y1="40" x2={x} y2="58" className="pi-line" />)}{lawn(6, 64, 108, 10)}</svg>,
    <svg {...common}>{lawn(6, 6, 108, 68)}{[[14, 14], [50, 14], [86, 14], [14, 46], [50, 46], [86, 46]].map(([x, y]) => <rect key={`${x}${y}`} x={x} y={y} width="22" height="18" className="pi-bldg" />)}</svg>,
    <svg {...common}><path d="M8 8 H112 V30 H40 V72 H8 Z" className="pi-bldg" />{lawn(48, 38, 64, 34)}</svg>,
    <svg {...common}><rect x="20" y="10" width="80" height="44" className="pi-bldg" />{[28, 42, 56, 70, 84].map((x) => <rect key={x} x={x} y="54" width="8" height="6" className="pi-line-fill" />)}{lawn(6, 66, 108, 8)}</svg>,
    <svg {...common}>{lawn(6, 6, 108, 68)}<rect x="30" y="16" width="60" height="40" className="pi-bldg" /><path d="M60 26 V46 M50 36 H70" className="pi-cross" /></svg>,
  ];
  return icons[i % icons.length];
}

export function PropertyTypes() {
  return (
    <section className="ptypes section" aria-labelledby="ptypes-title">
      <div className="container">
        <div className="section-head">
          <RevealText className="section-title" id="ptypes-title">
            Built around the property you manage.
          </RevealText>
          <p className="section-intro">Every kind of site has its own priorities. We plan visits and scope around yours.</p>
        </div>
        <ul className="ptypes__grid">
          {propertyTypes.map((p, i) => (
            <li className="ptype" key={p.name}>
              <span className="ptype__art">
                <TypeIcon i={i} />
              </span>
              <h3 className="ptype__name">{p.name}</h3>
              <p className="ptype__need">{p.need}</p>
              <p className="ptype__text">{p.approach}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Benefits() {
  return (
    <section className="benefits section" aria-labelledby="benefits-title">
      <div className="container">
        <div className="section-head">
          <RevealText className="section-title section-title--light" id="benefits-title">
            What property managers get.
          </RevealText>
          <p className="section-intro section-intro--light">
            Less chasing, fewer surprises, and grounds that look the same on every visit.
          </p>
        </div>
        <ul className="benefits__grid">
          {commercialBenefits.map((b) => (
            <li key={b.title} className="benefit">
              <h3 className="benefit__title">{b.title}</h3>
              <p className="benefit__text">{b.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
