import Contact from '../sections/Contact';
import FAQ from '../sections/FAQ';
import { nextSteps } from '../data/content';

export default function ContactPage() {
  return (
    <>
      <Contact asPage />
      <section className="next section" aria-labelledby="next-title">
        <div className="container">
          <h2 className="next__title" id="next-title">
            What happens after you send it
          </h2>
          <ol className="next__list">
            {nextSteps.map((s, i) => (
              <li key={s.title} className="next__step">
                <span className="next__num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <FAQ />
    </>
  );
}
