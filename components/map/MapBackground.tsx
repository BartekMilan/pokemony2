import React from 'react';
import {
  Circle,
  Defs,
  G,
  Line,
  Path,
  Polygon,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  Text,
} from 'react-native-svg';

const W = 360;
const H = 640;

function Mountains({ cx, cy }: { cx: number; cy: number }) {
  return (
    <G>
      <Polygon
        points={`${cx},${cy - 28} ${cx - 18},${cy} ${cx + 18},${cy}`}
        fill="#9e8060"
        stroke="#5c3d1e"
        strokeWidth={1.5}
      />
      <Polygon
        points={`${cx + 14},${cy - 18} ${cx + 2},${cy} ${cx + 26},${cy}`}
        fill="#b8956e"
        stroke="#5c3d1e"
        strokeWidth={1.5}
      />
    </G>
  );
}

function ForestCluster({ cx, cy }: { cx: number; cy: number }) {
  const offsets = [
    [0, 0],
    [-10, 6],
    [10, 6],
    [-5, 12],
    [5, 12],
  ] as const;
  return (
    <G>
      {offsets.map(([dx, dy], i) => (
        <Circle
          key={i}
          cx={cx + dx}
          cy={cy + dy}
          r={7}
          fill="#5a7a40"
          stroke="#3d5c2a"
          strokeWidth={1}
        />
      ))}
    </G>
  );
}

function Castle({ cx, cy }: { cx: number; cy: number }) {
  return (
    <G>
      {/* Main wall */}
      <Rect
        x={cx - 14}
        y={cy - 10}
        width={28}
        height={20}
        fill="#8b7355"
        stroke="#5c3d1e"
        strokeWidth={1.5}
      />
      {/* Left tower */}
      <Rect
        x={cx - 18}
        y={cy - 20}
        width={10}
        height={24}
        fill="#7a6347"
        stroke="#5c3d1e"
        strokeWidth={1.5}
      />
      {/* Right tower */}
      <Rect
        x={cx + 8}
        y={cy - 20}
        width={10}
        height={24}
        fill="#7a6347"
        stroke="#5c3d1e"
        strokeWidth={1.5}
      />
      {/* Left merlon */}
      <Rect x={cx - 18} y={cy - 24} width={4} height={5} fill="#7a6347" stroke="#5c3d1e" strokeWidth={1} />
      <Rect x={cx - 12} y={cy - 24} width={4} height={5} fill="#7a6347" stroke="#5c3d1e" strokeWidth={1} />
      {/* Right merlon */}
      <Rect x={cx + 8} y={cy - 24} width={4} height={5} fill="#7a6347" stroke="#5c3d1e" strokeWidth={1} />
      <Rect x={cx + 14} y={cy - 24} width={4} height={5} fill="#7a6347" stroke="#5c3d1e" strokeWidth={1} />
      {/* Gate */}
      <Path
        d={`M ${cx - 4} ${cy + 10} L ${cx - 4} ${cy + 2} Q ${cx} ${cy - 2} ${cx + 4} ${cy + 2} L ${cx + 4} ${cy + 10}`}
        fill="#3d2a1a"
        stroke="#5c3d1e"
        strokeWidth={1}
      />
    </G>
  );
}

function Anchor({ cx, cy }: { cx: number; cy: number }) {
  return (
    <G>
      {/* Ring */}
      <Circle cx={cx} cy={cy - 8} r={5} fill="none" stroke="#5c3d1e" strokeWidth={1.5} />
      {/* Shaft */}
      <Line x1={cx} y1={cy - 3} x2={cx} y2={cy + 10} stroke="#5c3d1e" strokeWidth={1.5} />
      {/* Crossbar */}
      <Line x1={cx - 7} y1={cy - 1} x2={cx + 7} y2={cy - 1} stroke="#5c3d1e" strokeWidth={1.5} />
      {/* Arms */}
      <Path d={`M ${cx} ${cy + 10} Q ${cx - 8} ${cy + 12} ${cx - 6} ${cy + 6}`} fill="none" stroke="#5c3d1e" strokeWidth={1.5} />
      <Path d={`M ${cx} ${cy + 10} Q ${cx + 8} ${cy + 12} ${cx + 6} ${cy + 6}`} fill="none" stroke="#5c3d1e" strokeWidth={1.5} />
    </G>
  );
}

function TreasureX({ cx, cy }: { cx: number; cy: number }) {
  const r = 8;
  return (
    <G>
      <Circle cx={cx} cy={cy} r={r + 2} fill="none" stroke="#cc3333" strokeWidth={1.5} />
      <Line x1={cx - r} y1={cy - r} x2={cx + r} y2={cy + r} stroke="#cc3333" strokeWidth={2} strokeLinecap="round" />
      <Line x1={cx + r} y1={cy - r} x2={cx - r} y2={cy + r} stroke="#cc3333" strokeWidth={2} strokeLinecap="round" />
    </G>
  );
}

function CompassRose({ cx, cy }: { cx: number; cy: number }) {
  const outer = 20;
  const inner = 8;
  // 8-pointed star: alternating outer and inner points
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4 - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return (
    <G>
      <Polygon points={pts.join(' ')} fill="#d4a96e" stroke="#5c3d1e" strokeWidth={1} />
      <Circle cx={cx} cy={cy} r={4} fill="#5c3d1e" />
      <Text x={cx} y={cy - outer - 4} textAnchor="middle" fontSize={9} fontFamily="serif" fill="#5c3d1e">N</Text>
      <Text x={cx} y={cy + outer + 11} textAnchor="middle" fontSize={9} fontFamily="serif" fill="#5c3d1e">S</Text>
      <Text x={cx + outer + 6} y={cy + 3} textAnchor="middle" fontSize={9} fontFamily="serif" fill="#5c3d1e">E</Text>
      <Text x={cx - outer - 6} y={cy + 3} textAnchor="middle" fontSize={9} fontFamily="serif" fill="#5c3d1e">W</Text>
    </G>
  );
}

export default function MapBackground() {
  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <RadialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <Stop offset="0%" stopColor="#f4e4c1" stopOpacity={0} />
          <Stop offset="100%" stopColor="#8b6340" stopOpacity={0.35} />
        </RadialGradient>
      </Defs>

      {/* Parchment base */}
      <Rect x={0} y={0} width={W} height={H} fill="#f4e4c1" />

      {/* Island landmass */}
      <Path
        d={`
          M 40 540
          C 50 580 140 600 220 585
          C 290 572 340 530 335 450
          C 330 380 320 300 305 220
          C 295 160 270 90 230 65
          C 200 48 165 52 140 68
          C 108 88 78 130 62 180
          C 46 232 42 310 44 390
          C 45 450 34 510 40 540
          Z
        `}
        fill="#c8a96e"
        stroke="#5c3d1e"
        strokeWidth={2}
      />

      {/* Ocean wavy lines */}
      <Path d="M 10 80 Q 22 74 34 80 Q 46 86 58 80" fill="none" stroke="#7ab8d4" strokeWidth={1} opacity={0.7} />
      <Path d="M 10 92 Q 22 86 34 92 Q 46 98 58 92" fill="none" stroke="#7ab8d4" strokeWidth={1} opacity={0.7} />
      <Path d="M 6 106 Q 18 100 30 106 Q 42 112 54 106" fill="none" stroke="#7ab8d4" strokeWidth={1} opacity={0.5} />
      <Path d="M 310 550 Q 322 544 334 550 Q 346 556 358 550" fill="none" stroke="#7ab8d4" strokeWidth={1} opacity={0.7} />
      <Path d="M 308 564 Q 320 558 332 564 Q 344 570 356 564" fill="none" stroke="#7ab8d4" strokeWidth={1} opacity={0.7} />

      {/* Mountains near waypoint 2 (Mountain Pass ~200,300) */}
      <Mountains cx={195} cy={285} />

      {/* Mountains near top (behind peak ~180,120) */}
      <Mountains cx={175} cy={108} />

      {/* Forest cluster near waypoint 1 (Forest ~120,420) */}
      <ForestCluster cx={118} cy={410} />

      {/* Forest cluster left side */}
      <ForestCluster cx={72} cy={310} />

      {/* Castle near waypoint 3 (~280,200) */}
      <Castle cx={278} cy={195} />

      {/* Anchor / harbor label near waypoint 0 (~60,560) */}
      <Anchor cx={60} cy={555} />

      {/* Treasure X at waypoint 5 (~300,80) */}
      <TreasureX cx={300} cy={80} />

      {/* Compass rose — bottom right open water */}
      <CompassRose cx={330} cy={600} />

      {/* Vignette overlay */}
      <Rect x={0} y={0} width={W} height={H} fill="url(#vignette)" />

      {/* Parchment border */}
      <Rect
        x={6}
        y={6}
        width={W - 12}
        height={H - 12}
        fill="none"
        stroke="#8b6340"
        strokeWidth={3}
        rx={4}
      />
      <Rect
        x={10}
        y={10}
        width={W - 20}
        height={H - 20}
        fill="none"
        stroke="#5c3d1e"
        strokeWidth={1}
        rx={2}
        opacity={0.5}
      />

      {/* Map title */}
      <Text
        x={W / 2}
        y={630}
        textAnchor="middle"
        fontSize={13}
        fontFamily="serif"
        fill="#5c3d1e"
        fontStyle="italic"
      >
        Isle of Wonders
      </Text>
    </Svg>
  );
}
