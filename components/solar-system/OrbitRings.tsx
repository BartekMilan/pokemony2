import { Path } from 'react-native-svg';

const CX = 210;
const CY = 110;
const RX = 250;
// 16° tilt — strong depth (cos ≈ 0.96) while keeping back arc inside the sun disc
const SIN_TILT = 0.27564;
const RY = RX * SIN_TILT;

const STROKE = 'rgba(255,255,255,0.10)';
const STROKE_WIDTH = 1;

function orbitPoint(theta: number) {
  return {
    x: CX + RX * Math.cos(theta),
    y: CY - RY * Math.sin(theta),
  };
}

/** Back half of the orbit (θ: π → 2π) — drawn before the Sun so it occludes where they overlap. */
export function OrbitRingBack() {
  const left = orbitPoint(Math.PI);
  const right = orbitPoint(2 * Math.PI);

  return (
    <Path
      d={`M ${left.x} ${left.y} A ${RX} ${RY} 0 1 0 ${right.x} ${right.y}`}
      stroke={STROKE}
      strokeWidth={STROKE_WIDTH}
      fill="none"
    />
  );
}

/** Front half of the orbit (θ: 0 → π) — drawn after the Sun so it stays visible in front. */
export function OrbitRingFront() {
  const right = orbitPoint(0);
  const left = orbitPoint(Math.PI);

  return (
    <Path
      d={`M ${right.x} ${right.y} A ${RX} ${RY} 0 0 0 ${left.x} ${left.y}`}
      stroke={STROKE}
      strokeWidth={STROKE_WIDTH}
      fill="none"
    />
  );
}
