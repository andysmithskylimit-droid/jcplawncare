import Hero from '../sections/Hero';
import Statement from '../sections/Statement';
import Audiences from '../sections/Audiences';
import Services from '../sections/Services';
import Process from '../sections/Process';
import Standard from '../features/Standard';
import ToolsTeaser from '../features/ToolsTeaser';
import RecentWork from '../features/RecentWork';
import Crew from '../features/Crew';
import Slogan from '../features/Slogan';
import ReviewsBand from '../components/ReviewsBand';
import CTABand from '../components/CTABand';

export default function Home({ ready }) {
  return (
    <>
      <Hero ready={ready} />
      <Statement />
      <Audiences />
      <Services />
      <RecentWork />
      <Standard />
      <Crew />
      <Slogan />
      <Process />
      <ToolsTeaser />
      <ReviewsBand />
      <CTABand
        title="Ready for the sharpest lawn on the street?"
        text="Tell us about your home or commercial property and we will set up a walkthrough."
      />
    </>
  );
}
