import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/motion';
import { services } from '../data/content';
import { Link } from '../lib/router';
import { requestQuote } from '../lib/quote';
import ServiceArt from '../components/ServiceArt';
import ButtonLabel from '../components/ButtonLabel';
import Photo from '../components/Photo';
import { Lightbox } from './WorkGallery';
import { servicePhotoList } from '../data/photos';

function ServiceMedia({ service, onOpen }) {
  const list = servicePhotoList(service.id);
  const art = (
    <div className="svcd__art">
      <ServiceArt kind={service.art} />
    </div>
  );
  if (!list.length) return art;
  return (
    <div className="svcd__media">
      <button type="button" className="svcd__main" onClick={() => onOpen(list, 0)} data-cursor="View">
        <Photo photo={list[0]} size="lg" alt={list[0].alt} className="svcd__main-img" fallback={art} />
      </button>
      {list.length > 1 && (
        <div className="svcd__thumbs">
          {list.slice(1).map((p, i) => (
            <button type="button" key={p.id} className="svcd__thumb" onClick={() => onOpen(list, i + 1)} data-cursor="View">
              <Photo photo={p} alt={p.alt} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ServiceDetails() {
  const ref = useRef(null);
  const [active, setActive] = useState(services[0].id);
  const [lightbox, setLightbox] = useState(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.svcd').forEach((el) => {
        ScrollTrigger.create({ trigger: el, start: 'top 75%', once: true, onEnter: () => el.classList.add('is-active') });
        ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => self.isActive && setActive(el.id),
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="svcd-wrap section" ref={ref} aria-label="Service details">
      <div className="container svcd-grid">
        <nav className="svcd-index" aria-label="Services on this page">
          <ul>
            {services.map((s) => (
              <li key={s.id}>
                <Link to={`/services#${s.id}`} className={active === s.id ? 'is-active' : ''}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/lawn-guide#lawn-doctor" className="svcd-index__help">
            Not sure what you need? Try the lawn diagnostic.
          </Link>
        </nav>

        <div className="svcd-list">
          {services.map((s) => (
            <article className="svcd" id={s.id} key={s.id} aria-labelledby={`${s.id}-h`}>
              <ServiceMedia service={s} onOpen={(list, index) => setLightbox({ list, index })} />
              <div className="svcd__body">
                <p className="svcd__aud">{s.audience}</p>
                <h2 className="svcd__title" id={`${s.id}-h`}>
                  {s.title}
                </h2>
                <p className="svcd__lede">{s.summary}</p>
                <p className="svcd__text">{s.details}</p>
                <dl className="svcd__facts">
                  <div>
                    <dt>How often</dt>
                    <dd>{s.frequency}</dd>
                  </div>
                  <div>
                    <dt>Best time</dt>
                    <dd>{s.season}</dd>
                  </div>
                  <div>
                    <dt>Good for</dt>
                    <dd>{s.goodFor}</dd>
                  </div>
                </dl>
                <h3 className="svcd__h3">Included</h3>
                <ul className="svcd__includes">
                  {s.includes.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
                <div className="svcd__faq">
                  {s.faq.map((f) => (
                    <details key={f.q} onToggle={() => ScrollTrigger.refresh()}>
                      <summary>{f.q}</summary>
                      <p>{f.a}</p>
                    </details>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn btn--dark"
                  onClick={() =>
                    requestQuote({ service: s.option, propertyType: s.audience === 'Commercial' ? 'Commercial property' : undefined })
                  }
                >
                  <ButtonLabel>{`Get a quote for ${s.title.toLowerCase()}`}</ButtonLabel>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      {lightbox && (
        <Lightbox
          photos={lightbox.list}
          index={lightbox.index}
          onIndex={(index) => setLightbox((l) => ({ ...l, index }))}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}
