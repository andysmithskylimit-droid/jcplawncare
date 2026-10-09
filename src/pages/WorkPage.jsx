import PageHero from '../components/PageHero';
import CTABand from '../components/CTABand';
import ButtonLabel from '../components/ButtonLabel';
import WorkGallery from '../features/WorkGallery';
import { workPhotos, FACEBOOK_URL } from '../data/gallery';
import { requestQuote } from '../lib/quote';

export default function WorkPage() {
  return (
    <>
      <PageHero
        crumb="Our work"
        title="Our work, straight from the job site."
        intro={`${workPhotos.length} photos of lawns, yards and properties we have cared for across Greater Sacramento: mowing, new sod, bark and rock beds, hedge and tree trimming, and clean-ups.`}
      >
        <button type="button" className="btn btn--gold" onClick={() => requestQuote()}>
          <ButtonLabel>Get a free estimate</ButtonLabel>
        </button>
        <a className="btn btn--line" href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
          <ButtonLabel>Follow us on Facebook</ButtonLabel>
        </a>
      </PageHero>
      <section className="work-page section" aria-label="Photo gallery">
        <div className="container">
          <WorkGallery photos={workPhotos} initial={12} step={12} />
        </div>
      </section>
      <CTABand title="Want your yard in the next photo?" text="Tell us about your property and we will set up a free estimate." />
    </>
  );
}
