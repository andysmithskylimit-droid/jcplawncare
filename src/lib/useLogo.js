import { useEffect, useState } from 'react';

/**
 * Loads the brand logo (public/images/work/logo.jpg) and makes its black background
 * transparent, trimmed tight to the badge, so it sits cleanly on the site's dark greens.
 * Processed once per visit and shared by every place the logo appears.
 */
export const LOGO_SRC = '/images/work/logo.jpg';
let cached = null;
let pending = null;

function processLogo() {
  if (cached) return Promise.resolve(cached);
  if (pending) return pending;
  pending = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, 900 / img.naturalWidth);
        const w = Math.round(img.naturalWidth * scale);
        const h = Math.round(img.naturalHeight * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h);
        const px = data.data;
        let minX = w, minY = h, maxX = 0, maxY = 0;
        for (let i = 0; i < px.length; i += 4) {
          const m = Math.max(px[i], px[i + 1], px[i + 2]);
          const a = m <= 26 ? 0 : m >= 72 ? 255 : Math.round(((m - 26) / 46) * 255);
          px[i + 3] = a;
          if (a > 24) {
            const p = i / 4;
            const x = p % w;
            const y = (p - x) / w;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
        ctx.putImageData(data, 0, 0);
        const pad = 4;
        const cx = Math.max(0, minX - pad);
        const cy = Math.max(0, minY - pad);
        const cw = Math.min(w, maxX + pad) - cx;
        const ch = Math.min(h, maxY + pad) - cy;
        const out = document.createElement('canvas');
        out.width = cw > 0 ? cw : w;
        out.height = ch > 0 ? ch : h;
        out.getContext('2d').drawImage(canvas, cw > 0 ? cx : 0, ch > 0 ? cy : 0, out.width, out.height, 0, 0, out.width, out.height);
        cached = { src: out.toDataURL('image/png'), w: out.width, h: out.height };
      } catch {
        cached = { src: LOGO_SRC, w: img.naturalWidth, h: img.naturalHeight, raw: true };
      }
      resolve(cached);
    };
    img.onerror = () => resolve(null);
    img.src = LOGO_SRC;
  });
  return pending;
}

export function useLogo() {
  const [logo, setLogo] = useState(cached);
  useEffect(() => {
    if (cached) return;
    let alive = true;
    processLogo().then((l) => alive && l && setLogo(l));
    return () => {
      alive = false;
    };
  }, []);
  return logo;
}
