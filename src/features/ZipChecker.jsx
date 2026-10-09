import { useState } from 'react';
import { areas, company } from '../data/content';
import { requestQuote } from '../lib/quote';
import RevealText from '../components/RevealText';
import ButtonLabel from '../components/ButtonLabel';

export default function ZipChecker() {
  const [zip, setZip] = useState('');
  const [result, setResult] = useState(null);

  const check = (e) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(zip)) {
      setResult({ kind: 'invalid' });
      return;
    }
    const names = areas.filter((a) => a.zips.includes(zip)).map((a) => a.name);
    setResult(names.length ? { kind: 'yes', zip, names } : { kind: 'no', zip });
  };

  return (
    <section className="zip section" id="zip" aria-labelledby="zip-title">
      <div className="container zip__grid">
        <div>
          <RevealText className="section-title" id="zip-title">
            Is your property in our area?
          </RevealText>
          <p className="section-intro">
            Enter the property's ZIP code. If it is not on our usual list, call anyway; we may still be able to help.
          </p>
        </div>
        <div className="zip__box">
          <form className="zip__form" onSubmit={check} noValidate>
            <label htmlFor="zip-input" className="field__label">
              Property ZIP code
            </label>
            <div className="zip__row">
              <input
                id="zip-input"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                value={zip}
                placeholder="95670"
                aria-describedby="zip-result"
                onChange={(e) => {
                  setZip(e.target.value.replace(/\D/g, '').slice(0, 5));
                  setResult(null);
                }}
              />
              <button className="btn btn--gold" type="submit">
                <ButtonLabel>Check ZIP</ButtonLabel>
              </button>
            </div>
          </form>
          <div id="zip-result" className={`zip__result ${result ? `zip__result--${result.kind}` : ''}`} role="status" aria-live="polite">
            {result?.kind === 'yes' && (
              <>
                <p className="zip__verdict">Yes, {result.zip} is in our service area.</p>
                <p>That covers {result.names.join(' and ')}. Request a quote and we will set up a walkthrough.</p>
                <button type="button" className="btn btn--dark btn--sm" onClick={() => requestQuote({ note: `Property ZIP: ${result.zip}.` })}>
                  <ButtonLabel>Get a quote</ButtonLabel>
                </button>
              </>
            )}
            {result?.kind === 'no' && (
              <>
                <p className="zip__verdict">{result.zip} is outside our usual area.</p>
                <p>Call and we will tell you whether we can still help.</p>
                <a className="btn btn--dark btn--sm" href={company.phoneHref}>
                  <ButtonLabel>{`Call ${company.phoneDisplay}`}</ButtonLabel>
                </a>
              </>
            )}
            {result?.kind === 'invalid' && <p className="zip__verdict">Enter a 5-digit ZIP code, like 95670.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
