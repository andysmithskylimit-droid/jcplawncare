import { slogan } from '../data/content';
import RevealText from '../components/RevealText';

/** The company's slogan with the Matthew 6:33 citation. */
export default function Slogan() {
  return (
    <section className="slogan section" aria-labelledby="slogan-title">
      <div className="container slogan__inner">
        <p className="slogan__eyebrow">{slogan.intro}</p>
        <RevealText as="h2" className="slogan__title" id="slogan-title">
          {slogan.slogan}
        </RevealText>
        <figure className="slogan__verse">
          <blockquote>{slogan.verseText}</blockquote>
          <figcaption>— {slogan.verseRef}</figcaption>
        </figure>
      </div>
    </section>
  );
}
