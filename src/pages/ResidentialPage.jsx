import PageHero from '../components/PageHero';
import { HomePlan } from '../components/PlanArt';
import PlanCards from '../features/PlanCards';
import VisitTimeline from '../features/VisitTimeline';
import BeforeAfter from '../features/BeforeAfter';
import FAQ from '../sections/FAQ';
import CTABand from '../components/CTABand';
import ButtonLabel from '../components/ButtonLabel';
import { company, homeFaqs } from '../data/content';
import { requestQuote } from '../lib/quote';

export default function ResidentialPage() {
  return (
    <>
      <PageHero
        crumb="Residential"
        title="Home lawn care, kept to a higher standard."
        intro="Weekly or every-other-week mowing, clean edges, tidy beds and seasonal clean-ups for homes across Greater Sacramento."
        art={<HomePlan />}
      >
        <button type="button" className="btn btn--gold" onClick={() => requestQuote({ propertyType: 'Home' })}>
          <ButtonLabel>Get a home quote</ButtonLabel>
        </button>
        <a className="btn btn--line" href={company.phoneHref} data-cursor="Call">
          <ButtonLabel>{`Call ${company.phoneDisplay}`}</ButtonLabel>
        </a>
      </PageHero>
      <PlanCards />
      <VisitTimeline />
      <BeforeAfter />
      <FAQ items={homeFaqs} title="Homeowner questions" intro="Quick answers about service at your home." id="home-faq" prefix="hfaq" />
      <CTABand title="Get your weekends back." text="Tell us about your yard and we will recommend a schedule that fits it." preset={{ propertyType: 'Home' }} />
    </>
  );
}
