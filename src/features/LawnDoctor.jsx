import { useState } from 'react';
import { symptoms, services } from '../data/content';
import { Link } from '../lib/router';
import { requestQuote } from '../lib/quote';
import RevealText from '../components/RevealText';
import ButtonLabel from '../components/ButtonLabel';

export default function LawnDoctor() {
  const [sel, setSel] = useState([]);
  const chosen = symptoms.filter((s) => sel.includes(s.id));
  const ids = [...new Set(chosen.flatMap((s) => s.services))];
  const recs = services.filter((s) => ids.includes(s.id));
  const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <section className="doctor section" id="lawn-doctor" aria-labelledby="doctor-title">
      <div className="container doctor__grid">
        <div className="doctor__ask">
          <RevealText className="section-title" id="doctor-title">
            What is your lawn telling you?
          </RevealText>
          <p className="section-intro">Pick everything you can see. We will show the usual causes and what helps.</p>
          <div className="doctor__options" role="group" aria-label="Lawn problems">
            {symptoms.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={sel.includes(s.id)}
                className={`dx-opt ${sel.includes(s.id) ? 'is-on' : ''}`}
                onClick={() => toggle(s.id)}
              >
                <span className="dx-opt__mark" aria-hidden="true" />
                {s.label}
              </button>
            ))}
          </div>
          {sel.length > 0 && (
            <button type="button" className="text-btn" onClick={() => setSel([])}>
              Clear selection
            </button>
          )}
        </div>

        <div className="doctor__results" aria-live="polite">
          {chosen.length === 0 ? (
            <div className="dx-empty">
              <p className="dx-empty__title">Your results appear here.</p>
              <p>Start by picking a problem, like brown patches or weeds moving in.</p>
            </div>
          ) : (
            <>
              {chosen.map((s) => (
                <article className="dx-card" key={s.id}>
                  <h3 className="dx-card__title">{s.label}</h3>
                  <div className="dx-card__cols">
                    <div>
                      <h4>Common causes</h4>
                      <ul>
                        {s.causes.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>What helps</h4>
                      <ul>
                        {s.helps.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
              <div className="dx-recs">
                <h3 className="dx-recs__title">Services that help</h3>
                <ul>
                  {recs.map((r) => (
                    <li key={r.id}>
                      <Link to={`/services#${r.id}`}>{r.title}</Link>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="btn btn--gold"
                  onClick={() =>
                    requestQuote({
                      services: recs.map((r) => r.option),
                      note: `From the lawn diagnostic: ${chosen.map((c) => c.label.toLowerCase()).join('; ')}.`,
                    })
                  }
                >
                  <ButtonLabel>Get a quote for these</ButtonLabel>
                </button>
              </div>
              <p className="dx-note">General guidance only. We confirm what your lawn needs when we see it in person.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
