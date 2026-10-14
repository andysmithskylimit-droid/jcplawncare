import { residentialPlans } from '../data/content';
import { requestQuote } from '../lib/quote';
import RevealText from '../components/RevealText';
import ButtonLabel from '../components/ButtonLabel';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function Cadence({ data }) {
  if (!data) {
    return (
      <div className="cadence cadence--once">
        <span className="cadence__one" aria-hidden="true" />
        <span className="cadence__label">One visit, whenever you need it</span>
      </div>
    );
  }
  const peak = Math.max(...data);
  return (
    <figure className="cadence">
      <div className="cadence__bars" aria-hidden="true">
        {data.map((v, i) => (
          <span className="cadence__col" key={i}>
            <span className="cadence__dots">
              {Array.from({ length: 4 }).map((_, j) => (
                <i key={j} className={j < v ? 'on' : ''} />
              ))}
            </span>
            <span className="cadence__m">{MONTHS[i][0]}</span>
          </span>
        ))}
      </div>
      <figcaption className="cadence__label">
        Typical visits per month
        <span className="sr-only">
          : up to {peak} a month, active in {data.map((v, i) => (v ? MONTHS[i] : null)).filter(Boolean).join(', ')}
        </span>
      </figcaption>
    </figure>
  );
}

export default function PlanCards() {
  return (
    <section className="plans section" id="plans" aria-labelledby="plans-title">
      <div className="container">
        <div className="section-head">
          <RevealText className="section-title" id="plans-title">
            Pick the rhythm that fits your yard.
          </RevealText>
          <p className="section-intro">
            Most homes start with weekly or every-other-week service and add clean-ups as the seasons change. Not
            sure? We will recommend one when we see the lawn.
          </p>
        </div>
        <div className="plans__grid">
          {residentialPlans.map((p) => (
            <article className="plan-card" key={p.id}>
              <p className="plan-card__tag">{p.tagline}</p>
              <h3 className="plan-card__name">{p.name}</h3>
              <p className="plan-card__text">{p.text}</p>
              <Cadence data={p.cadence} />
              <ul className="plan-card__list">
                {p.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <button
                type="button"
                className="btn btn--dark btn--sm"
                onClick={() =>
                  requestQuote({
                    propertyType: 'Home',
                    service: p.id === 'seasonal' || p.id === 'onetime' ? 'Clean-up' : 'Mowing',
                    note: p.note,
                  })
                }
              >
                <ButtonLabel>{`Ask about ${p.name.toLowerCase()}`}</ButtonLabel>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
