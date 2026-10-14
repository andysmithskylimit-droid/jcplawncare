import PageHero from '../components/PageHero';
import LawnDoctor from '../features/LawnDoctor';
import Seasons from '../sections/Seasons';
import { GrassGuide, Tips } from '../features/GrassGuide';
import CTABand from '../components/CTABand';
import { Link } from '../lib/router';
import ButtonLabel from '../components/ButtonLabel';

export default function LawnGuidePage() {
  return (
    <>
      <PageHero
        crumb="Lawn guide"
        title="A lawn guide for the Sacramento Valley."
        intro="Hot, dry summers and wet winters ask different things of a lawn. Diagnose problems, learn your grass, and see what each season needs."
      >
        <Link to="/lawn-guide#lawn-doctor" className="btn btn--gold">
          <ButtonLabel>Diagnose my lawn</ButtonLabel>
        </Link>
        <Link to="/lawn-guide#grass" className="btn btn--line">
          <ButtonLabel>Find my mowing height</ButtonLabel>
        </Link>
      </PageHero>
      <LawnDoctor />
      <Seasons />
      <GrassGuide />
      <Tips />
      <CTABand title="Rather leave it to us?" text="We handle the mowing, edging and seasonal work so the lawn stays right all year." />
    </>
  );
}
