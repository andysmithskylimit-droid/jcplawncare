import { useMemo, useState } from 'react';
import { propertyTypes, scopeOptions } from '../data/content';
import { requestQuote } from '../lib/quote';
import RevealText from '../components/RevealText';
import ButtonLabel from '../components/ButtonLabel';

function Choice({ name, options, value, onChange, multi = false }) {
  return (
    <div className="chips">
      {options.map((o) => {
        const on = multi ? value.includes(o) : value === o;
        return (
          <label key={o} className={`chip ${on ? 'is-on' : ''}`}>
            <input type={multi ? 'checkbox' : 'radio'} name={name} checked={on} onChange={() => onChange(o)} />
            <span>{o}</span>
          </label>
        );
      })}
    </div>
  );
}

export default function ScopeBuilder() {
  const [type, setType] = useState(propertyTypes[0].name);
  const [sites, setSites] = useState(1);
  const [size, setSize] = useState('Not sure');
  const [areas, setAreas] = useState(['Lawns and turf', 'Shrubs and hedges', 'Planting beds']);
  const [freq, setFreq] = useState('Weekly');
  const [timing, setTiming] = useState('No preference');
  const [copied, setCopied] = useState('');

  const rows = useMemo(
    () => [
      ['Property type', type],
      ['Sites', String(sites)],
      ['Approximate size', size],
      ['Areas', areas.length ? areas.join(', ') : 'To be discussed'],
      ['Visit frequency', freq],
      ['Visit timing', timing],
    ],
    [type, sites, size, areas, freq, timing]
  );
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');

  const toggleArea = (a) => setAreas((s) => (s.includes(a) ? s.filter((x) => x !== a) : [...s, a]));
  const send = () => requestQuote({ propertyType: 'Commercial property', service: 'Commercial program', note: `Draft scope\n${text}` });
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied('Scope copied.');
    } catch {
      setCopied('Copying is blocked in this browser. Use "Send this scope" instead.');
    }
  };

  return (
    <section className="scope section" id="scope" aria-labelledby="scope-title">
      <div className="container">
        <div className="section-head">
          <RevealText className="section-title" id="scope-title">
            Draft your scope in a minute.
          </RevealText>
          <p className="section-intro">
            Choose what applies. The draft updates as you go, and you can send it straight to us with your quote request.
          </p>
        </div>

        <div className="scope__grid">
          <div className="scope__form">
            <fieldset className="scope__group">
              <legend>Property type</legend>
              <Choice name="scope-type" options={propertyTypes.map((p) => p.name)} value={type} onChange={setType} />
            </fieldset>

            <fieldset className="scope__group">
              <legend>Number of sites</legend>
              <div className="stepper">
                <button type="button" aria-label="Fewer sites" onClick={() => setSites((s) => Math.max(1, s - 1))}>
                  −
                </button>
                <output aria-live="polite">{sites}</output>
                <button type="button" aria-label="More sites" onClick={() => setSites((s) => Math.min(50, s + 1))}>
                  +
                </button>
              </div>
            </fieldset>

            <fieldset className="scope__group">
              <legend>Approximate size of each site</legend>
              <Choice name="scope-size" options={scopeOptions.sizes} value={size} onChange={setSize} />
            </fieldset>

            <fieldset className="scope__group">
              <legend>Areas to maintain</legend>
              <Choice name="scope-areas" options={scopeOptions.areas} value={areas} onChange={toggleArea} multi />
            </fieldset>

            <fieldset className="scope__group">
              <legend>How often</legend>
              <Choice name="scope-freq" options={scopeOptions.frequencies} value={freq} onChange={setFreq} />
            </fieldset>

            <fieldset className="scope__group">
              <legend>When visits should happen</legend>
              <Choice name="scope-timing" options={scopeOptions.timings} value={timing} onChange={setTiming} />
            </fieldset>
          </div>

          <aside className="scope__card" aria-labelledby="scope-card-title">
            <h3 className="scope__card-title" id="scope-card-title">
              Draft scope
            </h3>
            <dl className="scope__rows" aria-live="polite">
              {rows.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="scope__actions">
              <button type="button" className="btn btn--gold" onClick={send}>
                <ButtonLabel>Send this scope</ButtonLabel>
              </button>
              <button type="button" className="text-btn text-btn--light" onClick={copy}>
                Copy as text
              </button>
            </div>
            <p className="scope__copied" role="status">
              {copied}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
