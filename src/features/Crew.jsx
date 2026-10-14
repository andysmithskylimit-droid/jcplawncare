import { useState } from 'react';
import { company } from '../data/content';
import { requestQuote } from '../lib/quote';
import RevealText from '../components/RevealText';
import ButtonLabel from '../components/ButtonLabel';
import Logo from '../components/Logo';

const DIR = '/images/work/family%20and%20work%20photos/';
const fam = (name) => DIR + encodeURIComponent(name);

/*
 * Crew and family photos. To add another photo from the
 * "family and work photos" folder, copy one of these lines and change the file name.
 */
const TILES = [
  {
    src: fam('WhatsApp Image 2026-10-14 at 2.26.33 AM.jpeg'),
    alt: 'The JCP Lawn Service crew in the work truck on the way to a job',
    kind: 'main',
    pos: 'center 55%',
  },
  {
    src: fam('WhatsApp Image 2026-10-14 at 2.26.32 AM (2).jpeg'),
    alt: 'Two members of the JCP Lawn Service family',
    kind: 'tall',
    pos: 'center 30%',
  },
  { src: '/images/work/jcp-work-026-sm.jpg', alt: 'Tree trimming on a JCP job', kind: 'small', pos: 'center' },
  { src: '/images/work/jcp-work-110-sm.jpg', alt: 'A backyard lawn after a JCP visit', kind: 'small', pos: 'center' },
];

export default function Crew() {
  const [hidden, setHidden] = useState(() => new Set());

  return (
    <section className="crew section" aria-labelledby="crew-title">
      <div className="container crew__grid">
        <div className="crew__copy">
          <RevealText className="section-title section-title--light" id="crew-title">
            The people behind the lawns.
          </RevealText>
          <p className="section-intro section-intro--light">
            JCP Lawn Service is a small, local crew based right here in Rancho Cordova. We take pride in leaving every
            property looking sharp, and we treat every yard like our own.
          </p>
          <div className="crew__logo">
            <Logo variant="feature" />
          </div>
          <div className="crew__actions">
            <button type="button" className="btn btn--gold" onClick={() => requestQuote()}>
              <ButtonLabel>Get a free estimate</ButtonLabel>
            </button>
            <a className="crew__phone" href={company.phoneHref} data-cursor="Call">
              Call or text {company.phoneDisplay}
            </a>
          </div>
        </div>

        <ul className="crew__mosaic">
          {TILES.map((t, i) =>
            hidden.has(i) ? null : (
              <li key={t.src} className={`crew__tile crew__tile--${t.kind}`}>
                <img
                  src={t.src}
                  alt={t.alt}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: t.pos }}
                  onError={() => setHidden((s) => new Set(s).add(i))}
                />
              </li>
            )
          )}
        </ul>
      </div>
    </section>
  );
}
