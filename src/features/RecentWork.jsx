import { workHighlights, workPhotos } from '../data/gallery';
import { Link } from '../lib/router';
import RevealText from '../components/RevealText';
import ButtonLabel from '../components/ButtonLabel';
import WorkGallery from './WorkGallery';

/** Home page teaser: nine hand-picked job photos, one featured large. */
export default function RecentWork() {
  return (
    <section className="recent section" aria-labelledby="recent-title">
      <div className="container">
        <div className="section-head">
          <RevealText className="section-title" id="recent-title">
            Real yards. Real results.
          </RevealText>
          <div>
            <p className="section-intro">
              Straight from our jobs across Greater Sacramento: fresh-cut lawns, new sod, bark and rock beds, and
              clean-ups.
            </p>
            <Link to="/our-work" className="btn btn--dark recent__all">
              <ButtonLabel>{`See all ${workPhotos.length} photos`}</ButtonLabel>
            </Link>
          </div>
        </div>
        <WorkGallery photos={workHighlights.slice(0, 9)} initial={9} step={9} feature />
      </div>
    </section>
  );
}
