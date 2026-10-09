import { company } from '../data/content';
import { requestQuote } from '../lib/quote';
import RevealText from './RevealText';
import ButtonLabel from './ButtonLabel';
import Magnetic from './Magnetic';

export default function CTABand({ title = "Let's get your property looking its best.", text, preset }) {
  return (
    <section className="cta-band" aria-label="Request a quote">
      <div className="container cta-band__inner">
        <RevealText className="cta-band__title">{title}</RevealText>
        <div className="cta-band__side">
          {text && <p>{text}</p>}
          <div className="cta-band__actions">
            <Magnetic>
              <button type="button" className="btn btn--dark btn--lg" onClick={() => requestQuote(preset)}>
                <ButtonLabel>Get a quote</ButtonLabel>
              </button>
            </Magnetic>
            <a className="btn btn--outline-dark btn--lg" href={company.phoneHref} data-cursor="Call">
              <ButtonLabel>{`Call ${company.phoneDisplay}`}</ButtonLabel>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
