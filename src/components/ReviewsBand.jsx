import { useState } from 'react';
import { company, reviewStats, testimonials } from '../data/content';
import ButtonLabel from './ButtonLabel';

function Stars({ n = 5 }) {
  return (
    <span className="reviews__stars" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" aria-hidden="true" className={i < n ? 'is-on' : ''}>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.8L10 15l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </span>
  );
}

/* Facebook reviews are recommend / don't recommend, with no star rating */
function Recommends() {
  return (
    <span className="reviews__recommends">
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M7.6 14.2L3.4 10l1.4-1.4 2.8 2.8 7.6-7.6 1.4 1.4z" />
      </svg>
      Recommends JCP
    </span>
  );
}

function Carousel() {
  const [i, setI] = useState(0);
  if (!testimonials.length) return null;
  const t = testimonials[i];
  const n = testimonials.length;
  return (
    <figure className="reviews__card">
      {t.source === 'facebook' ? <Recommends /> : <Stars n={t.rating || 5} />}
      <blockquote className="reviews__quote">{t.quote}</blockquote>
      <figcaption className="reviews__by">
        <span className="reviews__name">{t.name}</span>
        {t.detail && <span className="reviews__detail">{t.detail}</span>}
      </figcaption>
      {n > 1 && (
        <div className="reviews__nav">
          <button type="button" className="text-btn" onClick={() => setI((i - 1 + n) % n)}>
            Previous review
          </button>
          <span aria-live="polite">
            {i + 1} of {n}
          </span>
          <button type="button" className="text-btn" onClick={() => setI((i + 1) % n)}>
            Next review
          </button>
        </div>
      )}
    </figure>
  );
}

export default function ReviewsBand() {
  return (
    <section className="reviews-band" aria-labelledby="reviews-title">
      <div className="container">
        <div className="reviews">
          <div className="reviews__copy">
            <h2 className="reviews__title" id="reviews-title">
              Ask the neighbors.
            </h2>
            <p>
              Read what customers say about JCP Lawn Service — these reviews are straight from our Google listing and
              Facebook page, where {reviewStats.facebookRecommendPercent}% of reviewers recommend us.
            </p>
            <div className="reviews__actions">
              <a className="btn btn--dark" href={company.mapsLink} target="_blank" rel="noopener noreferrer">
                <ButtonLabel>Read our Google reviews</ButtonLabel>
              </a>
              {company.facebookLink && (
                <a className="btn btn--dark" href={company.facebookLink} target="_blank" rel="noopener noreferrer">
                  <ButtonLabel>Facebook reviews</ButtonLabel>
                </a>
              )}
            </div>
          </div>
          <Carousel />
        </div>
      </div>
    </section>
  );
}
