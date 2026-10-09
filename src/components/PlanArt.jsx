/*
 * Top-down site plans, drawn the way grounds crews and landscape architects see a property.
 * Classes: .ln = line that draws itself, .stp = lawn stripe that "mows" in, .pop = element that settles in.
 * Animation is CSS-driven and starts when an ancestor gets .is-drawn (see sections.css).
 */
const d = (i) => ({ '--d': i });

function Stripes({ x, y, w, h, count, clip, start = 0 }) {
  const sw = w / count;
  return (
    <g clipPath={clip ? `url(#${clip})` : undefined}>
      {Array.from({ length: count }).map((_, i) => (
        <rect
          key={i}
          className={`stp ${i % 2 ? 'stp--up' : ''}`}
          x={x + i * sw}
          y={y}
          width={sw + 0.6}
          height={h}
          fill={i % 2 ? 'var(--stripe-dark)' : 'var(--stripe-light)'}
          style={d(start + i * 0.08)}
        />
      ))}
    </g>
  );
}

export function HomePlan() {
  return (
    <svg className="plan" viewBox="0 0 400 300" role="img" aria-label="Plan view of a home lot with a striped front lawn">
      <defs>
        <clipPath id="home-front">
          <path d="M28 168 H186 V272 H28 Z M222 168 H372 V272 H222 Z" />
        </clipPath>
        <clipPath id="home-back">
          <rect x="28" y="28" width="344" height="48" />
        </clipPath>
      </defs>
      <rect x="12" y="12" width="376" height="276" className="plan__lot ln" pathLength="1" style={d(0)} />
      <Stripes x={28} y={28} w={344} h={48} count={14} clip="home-back" start={0.6} />
      <Stripes x={28} y={168} w={344} h={104} count={14} clip="home-front" start={0.9} />
      <rect x="92" y="88" width="216" height="68" className="plan__house ln" pathLength="1" style={d(0.2)} />
      <path d="M92 122 H308 M146 88 V156 M254 88 V156" className="plan__roof ln" pathLength="1" style={d(0.45)} />
      <rect x="186" y="156" width="36" height="132" className="plan__hard pop" style={d(0.5)} />
      <line x1="12" y1="288" x2="388" y2="288" className="plan__curb ln" pathLength="1" style={d(0.3)} />
      <path d="M28 168 H186 M222 168 H372" className="plan__edge ln" pathLength="1" style={d(1.6)} />
      {[[52, 52, 16], [340, 50, 18], [60, 236, 14], [338, 228, 16]].map(([cx, cy, r], i) => (
        <g key={i} className="pop" style={d(1.2 + i * 0.1)}>
          <circle cx={cx} cy={cy} r={r} className="plan__tree" />
          <circle cx={cx} cy={cy} r={r * 0.28} className="plan__trunk" />
        </g>
      ))}
      <rect x="36" y="96" width="44" height="52" rx="10" className="plan__bed pop" style={d(1)} />
      <rect x="320" y="96" width="44" height="52" rx="10" className="plan__bed pop" style={d(1.1)} />
    </svg>
  );
}

export function SitePlan() {
  const stalls = Array.from({ length: 11 });
  return (
    <svg className="plan" viewBox="0 0 400 300" role="img" aria-label="Plan view of a commercial site with parking and striped lawn islands">
      <defs>
        <clipPath id="site-lawn">
          <path d="M20 20 H120 V140 H20 Z M20 200 H380 V280 H20 Z" />
        </clipPath>
      </defs>
      <rect x="12" y="12" width="376" height="276" className="plan__lot ln" pathLength="1" style={d(0)} />
      <Stripes x={20} y={20} w={360} h={260} count={18} clip="site-lawn" start={0.9} />
      <rect x="140" y="24" width="236" height="110" className="plan__house ln" pathLength="1" style={d(0.2)} />
      <path d="M140 79 H376 M218 24 V134 M298 24 V134" className="plan__roof ln" pathLength="1" style={d(0.4)} />
      <rect x="132" y="140" width="252" height="54" className="plan__hard pop" style={d(0.5)} />
      {stalls.map((_, i) => (
        <line key={i} x1={150 + i * 22} y1="142" x2={150 + i * 22} y2="166" className="plan__stall ln" pathLength="1" style={d(0.7 + i * 0.04)} />
      ))}
      <path d="M20 140 H120 M20 200 H380" className="plan__edge ln" pathLength="1" style={d(1.7)} />
      {[[48, 236], [104, 250], [168, 236], [232, 250], [296, 236], [356, 250]].map(([cx, cy], i) => (
        <g key={i} className="pop" style={d(1.3 + i * 0.08)}>
          <circle cx={cx} cy={cy} r="14" className="plan__tree" />
          <circle cx={cx} cy={cy} r="4" className="plan__trunk" />
        </g>
      ))}
      <rect x="40" y="48" width="60" height="64" rx="12" className="plan__bed pop" style={d(1.1)} />
    </svg>
  );
}
