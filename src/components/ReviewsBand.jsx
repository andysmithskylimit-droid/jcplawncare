import { useState } from 'react';
import { company, testimonials } from '../data/content';
import ButtonLabel from './ButtonLabel';

function Carousel() {
  const [i, setI] = useState(0);
  if (!testimonials.length) return null;
  const t = testimonials[i];
  const n = testimonials.length;
  return (
    <figure className="reviews__card">
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
              We would rather you hear it from the people we work for. Read what customers say about JCP Lawn Service
              on Google.
            </p>
            <a className="btn btn--dark" href={company.mapsLink} target="_blank" rel="noopener noreferrer">
              <ButtonLabel>Read our Google reviews</ButtonLabel>
            </a>
          </div>
          <Carousel />
        </div>
      </div>
    </section>
  );
}
