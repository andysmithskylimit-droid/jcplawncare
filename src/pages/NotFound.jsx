import PageHero from '../components/PageHero';
import { Link } from '../lib/router';
import ButtonLabel from '../components/ButtonLabel';

export default function NotFound() {
  return (
    <PageHero title="This page went to seed." intro="The page you were looking for doesn't exist or has moved.">
      <Link to="/" className="btn btn--gold">
        <ButtonLabel>Go to the home page</ButtonLabel>
      </Link>
      <Link to="/contact" className="btn btn--line">
        <ButtonLabel>Get a quote</ButtonLabel>
      </Link>
    </PageHero>
  );
}
