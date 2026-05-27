import { BlurMask, Circle } from '@shopify/react-native-skia';
import { type SharedValue, useDerivedValue } from 'react-native-reanimated';
import { WAYPOINTS } from '../data/pathDefinition';

// ---------------------------------------------------------------------------
// Approach B — precomputed arc-length-parameterised lookup table.
//
// Skia.PathMeasure does not exist in RN-Skia v2.2.12 (the API is
// Skia.ContourMeasureIter). ContourMeasureIter returns a JSI-backed object
// that cannot safely cross the reanimated worklet boundary, so all position
// look-ups must happen in pure JS data. We build a 1 000-sample table once
// at module load time — same Catmull-Rom maths as pathDefinition.ts — and
// index into it from the worklet.
// ---------------------------------------------------------------------------

type Pt = { x: number; y: number };

function cubicBezierPoint(p0: Pt, c1: Pt, c2: Pt, p1: Pt, t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p1.x,
    y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p1.y,
  };
}

// Build a flat array of (x, y) pairs sampled at equal arc-length intervals.
// Strategy: over-sample at fine t steps per segment, accumulate chord lengths,
// then re-sample at evenly spaced arc-length targets.
const N = 1000; // number of output samples (indices 0 … N-1)

const SAMPLE_X = new Float32Array(N);
const SAMPLE_Y = new Float32Array(N);

(function buildTable() {
  const OVERSAMPLE = 500; // chord steps per segment

  // 1. Collect all raw (arcLen, x, y) measurements.
  const raw: { s: number; x: number; y: number }[] = [];
  let s = 0;
  raw.push({ s: 0, x: WAYPOINTS[0].x, y: WAYPOINTS[0].y });

  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    const p0 = WAYPOINTS[i - 1] ?? WAYPOINTS[i];
    const p1 = WAYPOINTS[i];
    const p2 = WAYPOINTS[i + 1];
    const p3 = WAYPOINTS[i + 2] ?? WAYPOINTS[i + 1];
    const c1: Pt = {
      x: p1.x + (p2.x - p0.x) / 6,
      y: p1.y + (p2.y - p0.y) / 6,
    };
    const c2: Pt = {
      x: p2.x - (p3.x - p1.x) / 6,
      y: p2.y - (p3.y - p1.y) / 6,
    };

    let prev: Pt = p1;
    for (let k = 1; k <= OVERSAMPLE; k++) {
      const t = k / OVERSAMPLE;
      const cur = cubicBezierPoint(p1, c1, c2, p2, t);
      s += Math.hypot(cur.x - prev.x, cur.y - prev.y);
      raw.push({ s, x: cur.x, y: cur.y });
      prev = cur;
    }
  }

  const totalS = raw[raw.length - 1].s;

  // 2. Re-sample at N evenly-spaced arc-length targets using linear interpolation.
  let rawIdx = 0;
  for (let n = 0; n < N; n++) {
    const target = (n / (N - 1)) * totalS;
    while (rawIdx < raw.length - 1 && raw[rawIdx + 1].s < target) {
      rawIdx++;
    }
    const a = raw[rawIdx];
    const b = raw[Math.min(rawIdx + 1, raw.length - 1)];
    const span = b.s - a.s;
    const frac = span > 0 ? (target - a.s) / span : 0;
    SAMPLE_X[n] = a.x + frac * (b.x - a.x);
    SAMPLE_Y[n] = a.y + frac * (b.y - a.y);
  }
})();

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LeadingDot({ progress }: { progress: SharedValue<number> }) {
  const cx = useDerivedValue(() => {
    'worklet';
    const i = Math.min(N - 1, Math.max(0, Math.floor(progress.value * (N - 1))));
    return SAMPLE_X[i];
  });

  const cy = useDerivedValue(() => {
    'worklet';
    const i = Math.min(N - 1, Math.max(0, Math.floor(progress.value * (N - 1))));
    return SAMPLE_Y[i];
  });

  return (
    <Circle cx={cx} cy={cy} r={5} color="#fff8dc">
      <BlurMask blur={2} style="solid" />
    </Circle>
  );
}
