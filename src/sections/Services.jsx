import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/motion';
import { services } from '../data/content';
import RevealText from '../components/RevealText';
import ServiceArt from '../components/ServiceArt';
import Photo from '../components/Photo';
import { servicePhotoList } from '../data/photos';
import { Link } from '../lib/router';

export default function Services() {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: pin the section and translate the track sideways as you scroll down.
      mm.add('(min-width: 960px) and (prefers-reduced-motion: no-preference)', () => {
        const track = trackRef.current;
        const distance = () => Math.max(0, track.scrollWidth - viewportRef.current.clientWidth);
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
        gsap.utils.toArray('.svc').forEach((card) => {
          ScrollTrigger.create({
            trigger: card,
            containerAnimation: tween,
            start: 'left 88%',
            once: true,
            onEnter: () => card.classList.add('is-active'),
          });
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Mobile / reduced motion: native swipe track, cards wake up as they come into view.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 960px) and (prefers-reduced-motion: no-preference)');
    if (mq.matches) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-active')),
      { threshold: 0.35 }
    );
    sectionRef.current.querySelectorAll('.svc').forEach((c) => io.observe(c));
    const onScroll = () => {
      const v = viewportRef.current;
      const max = v.scrollWidth - v.clientWidth;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? v.scrollLeft / max : 0})`;
    };
    const v = viewportRef.current;
    v.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      v.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className="services" id="services" ref={sectionRef} aria-labelledby="services-title">
      <div className="services__frame">
        <div className="container services__head">
          <RevealText className="section-title section-title--light" id="services-title">
            Everything the lawn needs, and the beds and hedges around it.
          </RevealText>
          <div className="services__meta">
            <p className="section-intro section-intro--light">
              Mix and match for a home, or bundle into one scope for a commercial site. Every visit ends with
              walks and drives blown clean.
            </p>
            <Link to="/services" className="text-btn text-btn--light services__all">
              See every service in detail
            </Link>
            <div className="services__progress" aria-hidden="true">
              <span className="services__progress-bar" ref={barRef} />
            </div>
          </div>
        </div>

        <div className="services__viewport" ref={viewportRef}>
          <ul className="services__track" ref={trackRef}>
            {services.map((s) => (
              <li className="svc" key={s.id}>
                <div className="svc__art">
                  <Photo
                    photo={servicePhotoList(s.id)[0]}
                    className="svc__photo"
                    fallback={<ServiceArt kind={s.art} />}
                  />
                </div>
                <div className="svc__body">
                  <p className="svc__audience">{s.audience}</p>
                  <h3 className="svc__title">{s.title}</h3>
                  <p className="svc__summary">{s.summary}</p>
                  <ul className="svc__includes" aria-label={`${s.title} includes`}>
                    {s.includes.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                  <Link to={`/services#${s.id}`} className="svc__link">
                    More about {s.title.toLowerCase()}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
