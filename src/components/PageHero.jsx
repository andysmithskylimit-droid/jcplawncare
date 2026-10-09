import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { Link, useRouter } from '../lib/router';
import { findRoute } from '../data/routes';
import { pageHeroPhotos, photoById } from '../data/photos';
import RevealText from './RevealText';
import Photo from './Photo';

/** Header for every inner page: job photo background, breadcrumb, headline, intro, optional plan drawing, stripe band. */
export default function PageHero({ crumb, title, intro, art, children }) {
  const ref = useRef(null);
  const { path } = useRouter();
  const photoId = pageHeroPhotos[path] ?? (findRoute(path) ? null : pageHeroPhotos.notFound);
  const photo = photoId ? photoById(photoId) : null;

  useEffect(() => {
    const t = setTimeout(() => ref.current && ref.current.classList.add('is-drawn'), 350);
    return () => clearTimeout(t);
  }, []);

  // Slow parallax on the background photo
  useLayoutEffect(() => {
    if (prefersReducedMotion || !photo) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.page-hero__bg-img',
        { yPercent: 0 },
        { yPercent: 10, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } }
      );
    }, ref);
    return () => ctx.revert();
  }, [photo]);

  return (
    <section className={`page-hero ${art ? 'page-hero--art' : ''} ${photo ? 'page-hero--photo' : ''}`} ref={ref}>
      {photo && (
        <div className="page-hero__bg" aria-hidden="true">
          <Photo photo={photo} size="lg" alt="" eager className="page-hero__bg-img" fetchpriority="high" />
        </div>
      )}
      <div className="container page-hero__grid">
        <div className="page-hero__copy">
          {crumb && (
            <nav aria-label="Breadcrumb" className="crumbs">
              <ol>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li aria-current="page">{crumb}</li>
              </ol>
            </nav>
          )}
          <RevealText as="h1" className="page-hero__title" delay={0.35}>
            {title}
          </RevealText>
          {intro && <p className="page-hero__intro">{intro}</p>}
          {children && <div className="page-hero__actions">{children}</div>}
        </div>
        {art && <div className="page-hero__art">{art}</div>}
      </div>
      <div className="page-hero__stripes" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className={i % 2 ? 'is-up' : ''} style={{ '--d': 0.3 + i * 0.045 }} />
        ))}
      </div>
    </section>
  );
}
