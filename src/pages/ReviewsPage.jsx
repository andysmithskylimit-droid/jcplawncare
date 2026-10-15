import { useEffect, useMemo, useState } from 'react';
import PageHero from '../components/PageHero';
import CTABand from '../components/CTABand';
import ButtonLabel from '../components/ButtonLabel';
import { ReviewBadge } from '../components/ReviewsBand';
import { company, reviewSources, reviewStats, reviewThemes, testimonials } from '../data/content';
import { requestQuote } from '../lib/quote';
import { ScrollTrigger } from '../lib/motion';

const FILTERS = [
  { id: 'all', label: 'All reviews' },
  { id: 'google', label: 'Google' },
  { id: 'facebook', label: 'Facebook' },
];

export default function ReviewsPage() {
  const [filter, setFilter] = useState('all');
  const total = testimonials.length;

  const counts = useMemo(() => {
    const c = { all: total };
    for (const t of testimonials) c[t.source] = (c[t.source] || 0) + 1;
    return c;
  }, [total]);

  const themes = useMemo(
    () => reviewThemes.map((th) => ({ ...th, count: testimonials.filter((t) => th.match.test(t.quote)).length })),
    []
  );

  const shown = filter === 'all' ? testimonials : testimonials.filter((t) => t.source === filter);

  // The grid height changes when filtering, so re-measure scroll-driven animations below it.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [filter]);

  return (
    <>
      <PageHero
        crumb="Reviews"
        title="Straight from the neighbors."
        intro={`${total} reviews from homeowners and property managers across Greater Sacramento, collected from our Google listing and Facebook page. ${reviewStats.facebookRecommendPercent}% of our Facebook reviewers recommend JCP.`}
      >
        <button type="button" className="btn btn--gold" onClick={() => requestQuote()}>
          <ButtonLabel>Get a free estimate</ButtonLabel>
        </button>
        <a className="btn btn--line" href={company.mapsLink} target="_blank" rel="noopener noreferrer">
          <ButtonLabel>See us on Google</ButtonLabel>
        </a>
      </PageHero>

      <section className="reviews-page section" aria-labelledby="reviews-page-title">
        <div className="container">
          <h2 className="sr-only" id="reviews-page-title">
            Customer reviews
          </h2>

          <ul className="reviews-summary" aria-label="Review highlights">
            <li className="reviews-summary__item reviews-summary__item--lead">
              <span className="reviews-summary__num">{reviewStats.facebookRecommendPercent}%</span>
              <span className="reviews-summary__label">of Facebook reviewers recommend JCP</span>
            </li>
            {themes.map((th) => (
              <li key={th.label} className="reviews-summary__item">
                <span className="reviews-summary__num">
                  {th.count}
                  <small> of {total}</small>
                </span>
                <span className="reviews-summary__label">
                  reviews mention <strong>{th.label.toLowerCase()}</strong>
                </span>
              </li>
            ))}
          </ul>

          <div className="reviews-filter" role="group" aria-label="Filter reviews by source">
            {FILTERS.map((f) =>
              counts[f.id] ? (
                <button
                  key={f.id}
                  type="button"
                  className={`reviews-filter__btn ${filter === f.id ? 'is-active' : ''}`}
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                  <span className="reviews-filter__count">{counts[f.id]}</span>
                </button>
              ) : null
            )}
          </div>

          <ul className="review-grid" aria-live="polite">
            {shown.map((t) => (
              <li key={t.name} className="review-card">
                <figure className="review-card__inner">
                  <ReviewBadge review={t} />
                  <blockquote className="review-card__quote">
                    <p>{t.quote}</p>
                  </blockquote>
                  <figcaption className="review-card__by">
                    <span className="review-card__avatar" aria-hidden="true">
                      {t.name.charAt(0)}
                    </span>
                    <span className="review-card__who">
                      <span className="review-card__name">{t.name}</span>
                      <span className="review-card__source">{reviewSources[t.source]}</span>
                    </span>
                  </figcaption>
                  {t.job && <span className="review-card__job">{t.job}</span>}
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="reviews-leave" aria-labelledby="reviews-leave-title">
        <div className="container reviews-leave__inner">
          <div>
            <h2 className="reviews-leave__title" id="reviews-leave-title">
              Worked with us? Tell your neighbors.
            </h2>
            <p className="reviews-leave__text">
              A quick review helps other Sacramento homeowners find a crew they can count on, and it means a lot to our
              small team.
            </p>
          </div>
          <div className="reviews-leave__actions">
            <a className="btn btn--gold" href={company.mapsLink} target="_blank" rel="noopener noreferrer">
              <ButtonLabel>Review us on Google</ButtonLabel>
            </a>
            {company.facebookLink && (
              <a className="btn btn--line" href={company.facebookLink} target="_blank" rel="noopener noreferrer">
                <ButtonLabel>Recommend us on Facebook</ButtonLabel>
              </a>
            )}
          </div>
        </div>
      </section>

      <CTABand title="Ready to be our next five-star yard?" text="Tell us about your property and we will set up a free estimate." />
    </>
  );
}
