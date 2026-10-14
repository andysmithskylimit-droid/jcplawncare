import { useLogo } from '../lib/useLogo';

/** Small striped mark, kept as the favicon-style fallback when the logo image is unavailable. */
export function LogoMark({ size = 34, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 34 34" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="32" height="32" rx="3" fill="#143A22" />
      <rect x="5" y="5" width="6" height="20" fill="#8DB654" />
      <rect x="11" y="5" width="6" height="20" fill="#4F7F35" />
      <rect x="17" y="5" width="6" height="20" fill="#8DB654" />
      <rect x="23" y="5" width="6" height="20" fill="#4F7F35" />
      <rect x="5" y="27" width="24" height="2" fill="#E4B842" />
    </svg>
  );
}

/**
 * The JCP Lawn Service badge (public/images/work/logo.jpg).
 * variant: 'header' | 'footer' | 'preloader' | 'feature'
 */
export default function Logo({ variant = 'header' }) {
  const logo = useLogo();

  if (logo) {
    return (
      <span className={`logo logo--img logo--${variant}`}>
        <img className="logo__img" src={logo.src} width={logo.w} height={logo.h} alt="JCP Lawn Service" decoding="async" />
      </span>
    );
  }

  if (variant === 'preloader') return <span className="pl-brand-name">JCP</span>;

  return (
    <span className={`logo logo--${variant}`}>
      <LogoMark size={variant === 'footer' ? 44 : 34} />
      <span className="logo__type">
        <span className="logo__name">JCP</span>
        <span className="logo__sub">Lawn Service</span>
      </span>
    </span>
  );
}
