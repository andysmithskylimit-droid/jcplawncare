import PageHero from '../components/PageHero';
import ZipChecker from '../features/ZipChecker';
import ServiceArea from '../sections/ServiceArea';
import ReviewsBand from '../components/ReviewsBand';
import CTABand from '../components/CTABand';
import { Link } from '../lib/router';
import ButtonLabel from '../components/ButtonLabel';

export default function ServiceAreaPage() {
  return (
    <>
      <PageHero
        crumb="Service area"
        title="Local crews, close to your property."
        intro="We are based on Malaga Way in Rancho Cordova and work across eastern Sacramento County and nearby communities."
      >
        <Link to="/service-area#zip" className="btn btn--gold">
          <ButtonLabel>Check my ZIP code</ButtonLabel>
        </Link>
      </PageHero>
      <ZipChecker />
      <ServiceArea />
      <ReviewsBand />
      <CTABand title="In the area? Let's take a look." text="Request a quote and we will set up a time to walk the property." />
    </>
  );
}
