import PageHero from '../components/PageHero';
import { SitePlan } from '../components/PlanArt';
import { PropertyTypes, Benefits } from '../features/CommercialInfo';
import ScopeBuilder from '../features/ScopeBuilder';
import Process from '../sections/Process';
import FAQ from '../sections/FAQ';
import CTABand from '../components/CTABand';
import ButtonLabel from '../components/ButtonLabel';
import { Link } from '../lib/router';
import { commercialFaqs, commercialProcess } from '../data/content';
import { requestQuote } from '../lib/quote';

export default function CommercialPage() {
  return (
    <>
      <PageHero
        crumb="Commercial"
        title="Grounds maintenance property managers don't have to chase."
        intro="Written scopes, set schedules and one point of contact for office parks, retail centers, HOAs, apartment communities and industrial sites."
        art={<SitePlan />}
      >
        <button type="button" className="btn btn--gold" onClick={() => requestQuote({ propertyType: 'Commercial property', service: 'Commercial program' })}>
          <ButtonLabel>Request a site walk</ButtonLabel>
        </button>
        <Link to="/commercial#scope" className="btn btn--line">
          <ButtonLabel>Draft a scope</ButtonLabel>
        </Link>
      </PageHero>
      <PropertyTypes />
      <Benefits />
      <ScopeBuilder />
      <Process title="How a commercial account starts" intro="A clear scope first, then a schedule you can count on." steps={commercialProcess} id="commercial-process" />
      <FAQ items={commercialFaqs} title="Questions from property managers" intro="Straight answers about how commercial service works." id="commercial-faq" prefix="cfaq" />
      <CTABand
        title="Let's walk your site."
        text="We will note every area and priority, then send a written scope and proposal."
        preset={{ propertyType: 'Commercial property', service: 'Commercial program' }}
      />
    </>
  );
}
