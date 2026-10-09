import { Fragment, useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';

/**
 * Section headings: each word rises out of its own mask when the heading scrolls into view.
 * This is the one shared heading treatment, so every section speaks the same motion language.
 */
export default function RevealText({ as: Tag = 'h2', children, className = '', delay = 0, ...rest }) {
  const ref = useRef(null);
  const text = String(children);
  const words = text.split(' ');

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from(ref.current.querySelectorAll('.rw-i'), {
        yPercent: 108,
        duration: 1.15,
        ease: 'expo.out',
        stagger: 0.045,
        delay,
        scrollTrigger: { trigger: ref.current, start: 'top 86%', once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, [delay]);

  return (
    <Tag ref={ref} className={`reveal ${className}`} aria-label={text} {...rest}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="rw" aria-hidden="true">
            <span className="rw-i">{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}
