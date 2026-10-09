/** Brand mark: a square lawn cut into four alternating stripes, with a gold edge line. */
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

export default function Logo() {
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo__type">
        <span className="logo__name">JCP</span>
        <span className="logo__sub">Lawn Service</span>
      </span>
    </span>
  );
}
