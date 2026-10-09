/*
 * One small plan-view drawing per service. Each animates once its card is active
 * (.is-active on the card). Shapes use the same .ln / .stp / .pop vocabulary as PlanArt.
 */
const d = (i) => ({ '--d': i });

function Frame({ children, label }) {
  return (
    <svg className="sart" viewBox="0 0 360 240" role="img" aria-label={label}>
      <rect x="10" y="10" width="340" height="220" className="sart__frame ln" pathLength="1" style={d(0)} />
      {children}
    </svg>
  );
}

function Mowing() {
  return (
    <Frame label="Lawn being striped by a mower">
      {Array.from({ length: 10 }).map((_, i) => (
        <rect
          key={i}
          className={`stp ${i % 2 ? 'stp--up' : ''}`}
          x={20 + i * 32}
          y="20"
          width="32.5"
          height="200"
          fill={i % 2 ? 'var(--stripe-dark)' : 'var(--stripe-light)'}
          style={d(0.2 + i * 0.12)}
        />
      ))}
      <g className="sart__mower">
        <rect x="-15" y="-11" width="30" height="22" rx="4" fill="var(--gold)" />
        <rect x="-11" y="-7" width="22" height="14" rx="2" fill="var(--turf-900)" opacity="0.35" />
        <path d="M-9 11 L-6 30 M9 11 L6 30 M-6 30 H6" stroke="var(--chalk)" strokeWidth="2" fill="none" />
      </g>
    </Frame>
  );
}

function Edging() {
  return (
    <Frame label="Crisp edge between lawn and sidewalk">
      <rect x="20" y="20" width="320" height="120" fill="var(--stripe-dark)" className="pop" style={d(0.1)} />
      {Array.from({ length: 5 }).map((_, i) => (
        <rect key={i} x={20 + i * 64} y="146" width="62" height="74" className="sart__slab pop" style={d(0.25 + i * 0.06)} />
      ))}
      <line x1="20" y1="143" x2="340" y2="143" className="sart__edge ln" pathLength="1" style={d(0.7)} />
      <g className="sart__spark" style={d(0.7)}>
        <circle r="4" fill="var(--gold)" />
      </g>
      {[[70, 70], [190, 60], [290, 90]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} l6 -18 l6 18`} className="sart__blades ln" pathLength="1" style={d(1 + i * 0.1)} />
      ))}
    </Frame>
  );
}

function Hedges() {
  const xs = [40, 104, 168, 232, 296];
  return (
    <Frame label="Overgrown shrubs shaped into clean hedges">
      <line x1="20" y1="190" x2="340" y2="190" className="sart__ground ln" pathLength="1" style={d(0.1)} />
      {xs.map((x, i) => (
        <g key={i}>
          <path
            className="sart__wild"
            d={`M${x} 190 C${x - 14} 160 ${x - 6} 92 ${x + 12} 96 C${x + 22} 70 ${x + 40} 84 ${x + 40} 104 C${x + 58} 110 ${x + 52} 160 ${x + 40} 190 Z`}
            style={d(0.3 + i * 0.1)}
          />
          <rect x={x - 4} y="110" width="48" height="80" rx="10" className="sart__hedge" style={d(0.6 + i * 0.1)} />
        </g>
      ))}
    </Frame>
  );
}

function Cleanup() {
  const leaves = Array.from({ length: 18 }).map((_, i) => {
    const x = 30 + ((i * 53) % 290);
    const y = 30 + ((i * 37) % 170);
    return { x, y, r: (i * 47) % 180, dx: 290 - x + ((i % 3) - 1) * 10, dy: 195 - y + ((i % 4) - 2) * 4 };
  });
  return (
    <Frame label="Leaves being cleared into a pile">
      <rect x="20" y="20" width="320" height="200" fill="var(--stripe-dark)" className="pop" style={d(0)} />
      {leaves.map((l, i) => (
        <ellipse
          key={i}
          cx={l.x}
          cy={l.y}
          rx="8"
          ry="4.5"
          className={`sart__leaf ${i % 3 === 0 ? 'sart__leaf--gold' : ''}`}
          style={{ '--dx': `${l.dx}px`, '--dy': `${l.dy}px`, '--r': `${l.r}deg`, '--d': 0.4 + i * 0.04 }}
        />
      ))}
    </Frame>
  );
}

function Aeration() {
  const plugs = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 9; c++) plugs.push([44 + c * 34 + (r % 2) * 17, 48 + r * 36]);
  return (
    <Frame label="Core aeration plugs across a lawn">
      <rect x="20" y="20" width="320" height="200" fill="var(--stripe-light)" className="pop" style={d(0)} />
      {plugs.map(([x, y], i) => (
        <g key={i} className="pop" style={d(0.3 + i * 0.025)}>
          <circle cx={x} cy={y} r="6" className="sart__hole" />
          <ellipse cx={x + 8} cy={y + 5} rx="5" ry="2.6" className="sart__core" />
        </g>
      ))}
    </Frame>
  );
}

function Beds() {
  const mulch = Array.from({ length: 70 }).map((_, i) => [70 + ((i * 41) % 230), 70 + ((i * 29) % 110)]);
  return (
    <Frame label="Garden bed with fresh mulch and plants">
      <rect x="20" y="20" width="320" height="200" fill="var(--stripe-dark)" className="pop" style={d(0)} />
      <path d="M60 120 C60 60 140 52 190 60 C260 70 312 80 304 132 C296 186 220 192 160 186 C100 180 60 170 60 120 Z" className="sart__bed pop" style={d(0.2)} />
      <path d="M60 120 C60 60 140 52 190 60 C260 70 312 80 304 132 C296 186 220 192 160 186 C100 180 60 170 60 120 Z" className="sart__edge ln" pathLength="1" style={d(0.4)} />
      <g clipPath="url(#bed-clip)">
        {mulch.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" className="sart__mulch pop" style={d(0.6 + (i % 10) * 0.05)} />
        ))}
      </g>
      <defs>
        <clipPath id="bed-clip">
          <path d="M60 120 C60 60 140 52 190 60 C260 70 312 80 304 132 C296 186 220 192 160 186 C100 180 60 170 60 120 Z" />
        </clipPath>
      </defs>
      {[[120, 110, 18], [190, 96, 22], [252, 128, 16], [170, 150, 14]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} className="sart__plant pop" style={d(1.1 + i * 0.12)} />
      ))}
    </Frame>
  );
}

function Irrigation() {
  const heads = [[60, 60], [300, 60], [60, 180], [300, 180]];
  const arc = (x, y, i) => {
    const dir = [[1, 1], [-1, 1], [1, -1], [-1, -1]][i];
    const r = 120;
    return `M${x} ${y} L${x + dir[0] * r} ${y} A${r} ${r} 0 0 ${dir[0] * dir[1] > 0 ? 1 : 0} ${x} ${y + dir[1] * r} Z`;
  };
  return (
    <Frame label="Sprinkler heads with overlapping spray coverage">
      <rect x="20" y="20" width="320" height="200" fill="var(--stripe-dark)" className="pop" style={d(0)} />
      <clipPath id="irr-clip">
        <rect x="20" y="20" width="320" height="200" />
      </clipPath>
      <g clipPath="url(#irr-clip)">
        {heads.map(([x, y], i) => (
          <path key={i} d={arc(x, y, i)} className="sart__spray" style={d(0.5 + i * 0.15)} />
        ))}
      </g>
      {heads.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="6" className="sart__head pop" style={d(0.3 + i * 0.08)} />
      ))}
    </Frame>
  );
}

function Site() {
  return (
    <Frame label="Commercial site plan with buildings, parking and lawn islands">
      <rect x="30" y="30" width="150" height="90" className="plan__house ln" pathLength="1" style={d(0.2)} />
      <rect x="200" y="30" width="130" height="60" className="plan__house ln" pathLength="1" style={d(0.3)} />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={36 + i * 24} y1="146" x2={36 + i * 24} y2="174" className="plan__stall ln" pathLength="1" style={d(0.5 + i * 0.04)} />
      ))}
      {[[30, 186, 90], [140, 186, 90], [250, 186, 80], [200, 100, 130]].map(([x, y, w], i) => (
        <g key={i}>
          {Array.from({ length: Math.round(w / 10) }).map((__, j) => (
            <rect
              key={j}
              className={`stp ${j % 2 ? 'stp--up' : ''}`}
              x={x + j * 10}
              y={y}
              width="10.4"
              height={i === 3 ? 26 : 30}
              fill={j % 2 ? 'var(--stripe-dark)' : 'var(--stripe-light)'}
              style={d(1 + i * 0.15 + j * 0.02)}
            />
          ))}
        </g>
      ))}
    </Frame>
  );
}

const ART = { mowing: Mowing, edging: Edging, hedges: Hedges, cleanup: Cleanup, aeration: Aeration, beds: Beds, irrigation: Irrigation, site: Site };

export default function ServiceArt({ kind }) {
  const Component = ART[kind] || Mowing;
  return <Component />;
}
