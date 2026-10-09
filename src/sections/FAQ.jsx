import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { faqs } from '../data/content';
import RevealText from '../components/RevealText';

function Item({ item, index, open, onToggle, prefix }) {
  const panel = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    const el = panel.current;
    if (!mounted.current) {
      mounted.current = true;
      gsap.set(el, { height: open ? 'auto' : 0 });
      return;
    }
    gsap.to(el, {
      height: open ? 'auto' : 0,
      duration: prefersReducedMotion ? 0 : open ? 0.6 : 0.45,
      ease: open ? 'expo.out' : 'power3.inOut',
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [open]);

  const id = `${prefix}-${index}`;
  return (
    <div className={`faq__item ${open ? 'is-open' : ''}`}>
      <h3 className="faq__q">
        <button type="button" aria-expanded={open} aria-controls={`${id}-a`} id={`${id}-q`} onClick={onToggle}>
          <span>{item.q}</span>
          <span className="faq__icon" aria-hidden="true" />
        </button>
      </h3>
      <div className="faq__a" id={`${id}-a`} role="region" aria-labelledby={`${id}-q`} ref={panel} hidden={false} aria-hidden={!open}>
        <p>{item.a}</p>
      </div>
    </div>
  );
}

export default function FAQ({ items = faqs, title = 'Questions, answered', intro = 'Something else on your mind? Call and ask.', id = 'faq', prefix = 'faq' }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq section" id={id} aria-labelledby={`${id}-title`}>
      <div className="container faq__grid">
        <div className="faq__head">
          <RevealText className="section-title" id={`${id}-title`}>
            {title}
          </RevealText>
          {intro && <p className="section-intro">{intro}</p>}
        </div>
        <div className="faq__list">
          {items.map((item, i) => (
            <Item key={item.q} item={item} index={i} prefix={prefix} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
