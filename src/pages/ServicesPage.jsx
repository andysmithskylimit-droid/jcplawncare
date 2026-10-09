import PageHero from '../components/PageHero';
import ServiceArt from '../components/ServiceArt';
import ServiceDetails from '../features/ServiceDetails';
import CTABand from '../components/CTABand';
import { Link } from '../lib/router';
import { requestQuote } from '../lib/quote';
import ButtonLabel from '../components/ButtonLabel';

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumb="Services"
        title="Everything the lawn needs, and the beds and hedges around it."
        intro="Eight services for homes and commercial properties. Book one, combine a few, or bundle them into a regular plan."
        art={<ServiceArt kind="mowing" />}
      >
        <button type="button" className="btn btn--gold" onClick={() => requestQuote()}>
          <ButtonLabel>Get a quote</ButtonLabel>
        </button>
        <Link to="/lawn-guide#lawn-doctor" className="btn btn--line">
          <ButtonLabel>Help me choose</ButtonLabel>
        </Link>
      </PageHero>
      <ServiceDetails />
      <CTABand title="Not sure which services you need?" text="Tell us what the property looks like today. We will recommend a plan after a quick walkthrough." />
    </>
  );
}
