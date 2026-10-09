import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ScrollTrigger, startScroll, stopScroll } from '../lib/motion';
import ButtonLabel from '../components/ButtonLabel';

const Chevron = ({ dir }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
);

/** Full-screen photo viewer: arrow keys, Escape, swipe on touch screens, click outside to close. */
export function Lightbox({ photos, index, onClose, onIndex }) {
  const closeRef = useRef(null);
  const touchX = useRef(null);
  const n = photos.length;
  const p = photos[index];
  const go = useCallback((d) => onIndex((index + d + n) % n), [index, n, onIndex]);

  useEffect(() => {
    const previous = document.activeElement;
    stopScroll();
    document.documentElement.classList.add('lb-open');
    closeRef.current && closeRef.current.focus();
    return () => {
      document.documentElement.classList.remove('lb-open');
      startScroll();
      previous && previous.focus && previous.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  // Preload the neighbours so next/previous feel instant.
  useEffect(() => {
    [1, -1].forEach((d) => {
      const q = photos[(index + d + n) % n];
      if (q) new Image().src = q.src;
    });
  }, [index, n, photos]);

  if (!p) return null;

  return createPortal(
    <div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${n}`}
      data-lenis-prevent=""
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <figure className="lb__figure" key={p.id}>
        <img src={p.src} width={p.w} height={p.h} alt={p.alt} className="lb__img" />
        <figcaption className="lb__count">
          {index + 1} / {n}
        </figcaption>
      </figure>
      {n > 1 && (
        <>
          <button type="button" className="lb__btn lb__btn--prev" aria-label="Previous photo" onClick={() => go(-1)}>
            <Chevron dir="left" />
          </button>
          <button type="button" className="lb__btn lb__btn--next" aria-label="Next photo" onClick={() => go(1)}>
            <Chevron dir="right" />
          </button>
        </>
      )}
      <button ref={closeRef} type="button" className="lb__close" aria-label="Close photo viewer" onClick={onClose}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>,
    document.body
  );
}

/**
 * Photo grid. Thumbnails lazy-load; the lightbox loads the larger version.
 * Tiles whose image file is missing hide themselves instead of showing a broken image.
 */
export default function WorkGallery({ photos, initial = 24, step = 24, feature = false }) {
  const [count, setCount] = useState(Math.min(initial, photos.length));
  const [open, setOpen] = useState(null);
  const [broken, setBroken] = useState(() => new Set());
  const visible = photos.slice(0, count);

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [count]);

  const thumbSize = (p) => {
    const s = 640 / Math.max(p.w, p.h);
    return { width: Math.round(p.w * s), height: Math.round(p.h * s) };
  };

  return (
    <>
      <ul className={`work-grid ${feature ? 'work-grid--feature' : ''}`}>
        {visible.map((p, i) =>
          broken.has(p.id) ? null : (
            <li key={p.id} className="work-tile" style={{ '--i': i % step }}>
              <button type="button" className="work-tile__btn" onClick={() => setOpen(i)} data-cursor="View">
                <img
                  src={feature && i === 0 ? p.src : p.thumb}
                  {...thumbSize(p)}
                  loading="lazy"
                  decoding="async"
                  alt={p.alt}
                  onError={() => setBroken((s) => new Set(s).add(p.id))}
                />
                <span className="sr-only">Open larger view</span>
              </button>
            </li>
          )
        )}
      </ul>

      {count < photos.length && (
        <div className="work-more">
          <button type="button" className="btn btn--dark" onClick={() => setCount((c) => Math.min(photos.length, c + step))}>
            <ButtonLabel>Show more photos</ButtonLabel>
          </button>
          <p className="work-more__count">
            Showing {count} of {photos.length}
          </p>
        </div>
      )}

      {open !== null && <Lightbox photos={photos} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />}
    </>
  );
}
