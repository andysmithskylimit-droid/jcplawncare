import { useEffect, useRef } from 'react';
import { gsap, hasFinePointer, prefersReducedMotion } from '../lib/motion';

const INTERACTIVE = 'a, button, [data-cursor], input, select, textarea, label, summary';

/** A gold dot with a trailing ring. Shows a short label over elements with data-cursor. */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion) return;
    const root = document.documentElement;
    root.classList.add('has-cursor');

    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.1, ease: 'power3' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.1, ease: 'power3' });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' });

    let visible = false;
    const show = (on) => {
      if (on === visible) return;
      visible = on;
      root.classList.toggle('cursor-visible', on);
    };
    const move = (e) => {
      show(true);
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e) => {
      const target = e.target.closest ? e.target.closest(INTERACTIVE) : null;
      const text = target ? target.getAttribute('data-cursor') || '' : '';
      ring.current.classList.toggle('is-hover', !!target);
      ring.current.classList.toggle('has-label', !!text);
      label.current.textContent = text;
      if (e.target.closest && e.target.closest('[data-cursor-hide]')) show(false);
    };
    const hide = () => show(false);

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    document.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    return () => {
      root.classList.remove('has-cursor', 'cursor-visible');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
      <div className="cursor-ring" ref={ring} aria-hidden="true">
        <span className="cursor-label" ref={label} />
      </div>
    </>
  );
}
