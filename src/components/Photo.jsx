import { useState } from 'react';

/**
 * A job photo with real dimensions (no layout shift), lazy loading, and a fallback:
 * if the file is missing, it renders `fallback` (for example the original illustration) instead.
 */
export default function Photo({ photo, size = 'sm', alt, className = '', eager = false, fallback = null, ...rest }) {
  const [failed, setFailed] = useState(false);
  if (!photo || failed) return fallback;
  const max = size === 'lg' ? 1400 : 640;
  const s = Math.min(1, max / Math.max(photo.w, photo.h));
  return (
    <img
      src={size === 'lg' ? photo.src : photo.thumb}
      width={Math.round(photo.w * s)}
      height={Math.round(photo.h * s)}
      alt={alt ?? photo.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
