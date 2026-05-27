export type Waypoint = { x: number; y: number; label: string };

export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 600;

export const WAYPOINTS: Waypoint[] = [
  { x:  60, y: 540, label: 'Harbor' },
  { x: 140, y: 420, label: 'Forest' },
  { x: 100, y: 280, label: 'River bend' },
  { x: 240, y: 220, label: 'Watchtower' },
  { x: 300, y: 360, label: 'Ruins' },
  { x: 340, y:  80, label: 'Treasure' },
];

function buildPathD(points: Waypoint[]): string {
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? points[i + 1];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

export const PATH_D: string = buildPathD(WAYPOINTS);

// Arc-length computation — pure JS numeric integration (Approach A).
// 100 chord samples per cubic Bezier segment; no Skia dependency at module load.

type Pt = { x: number; y: number };

function cubicBezierPoint(p0: Pt, c1: Pt, c2: Pt, p1: Pt, t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p1.x,
    y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p1.y,
  };
}

const SAMPLES_PER_SEGMENT = 100;

function computeArcLengths(points: Waypoint[]): { totalLength: number; cumulativeAtWaypoint: number[] } {
  let cumulative = 0;
  const cumulativeAtWaypoint: number[] = [0];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? points[i + 1];
    const c1: Pt = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2: Pt = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };

    let prev: Pt = p1;
    let segLen = 0;
    for (let s = 1; s <= SAMPLES_PER_SEGMENT; s++) {
      const t = s / SAMPLES_PER_SEGMENT;
      const cur = cubicBezierPoint(p1, c1, c2, p2, t);
      segLen += Math.hypot(cur.x - prev.x, cur.y - prev.y);
      prev = cur;
    }
    cumulative += segLen;
    cumulativeAtWaypoint.push(cumulative);
  }

  return { totalLength: cumulative, cumulativeAtWaypoint };
}

const { totalLength, cumulativeAtWaypoint } = computeArcLengths(WAYPOINTS);

export const TOTAL_LENGTH: number = totalLength;
export const WAYPOINT_PROGRESS: number[] = cumulativeAtWaypoint.map(l => l / totalLength);
