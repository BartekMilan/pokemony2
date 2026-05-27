export type Point = { x: number; y: number };

export type CubicSegment = {
  p0: Point;
  p1: Point;
  p2: Point;
  p3: Point;
};

export type MapPathData = {
  segments: CubicSegment[];
  segmentLengths: number[];
  totalLength: number;
  svgPathD: string;
};

// Waypoints: Harbor → Forest → Mountain Pass → Castle → Peak → Treasure
const WAYPOINTS: Point[] = [
  { x: 60, y: 560 },   // 0: Harbor (start)
  { x: 120, y: 420 },  // 1: Forest
  { x: 200, y: 300 },  // 2: Mountain Pass
  { x: 280, y: 200 },  // 3: Castle
  { x: 180, y: 120 },  // 4: Peak
  { x: 300, y: 80 },   // 5: Treasure (end)
];

// Catmull-Rom → cubic bezier conversion for C1-continuous path.
// For interior knots: CP1 = Pi + (Pi+1 - Pi-1) / 6, CP2 = Pi+1 - (Pi+2 - Pi) / 6
// Endpoints use the knot itself as the phantom point.
function buildSegments(pts: Point[]): CubicSegment[] {
  const n = pts.length;
  const segs: CubicSegment[] = [];

  for (let i = 0; i < n - 1; i++) {
    const prev = pts[i - 1] ?? pts[i]!;
    const curr = pts[i]!;
    const next = pts[i + 1]!;
    const after = pts[i + 2] ?? pts[i + 1]!;

    segs.push({
      p0: curr,
      p1: {
        x: curr.x + (next.x - prev.x) / 6,
        y: curr.y + (next.y - prev.y) / 6,
      },
      p2: {
        x: next.x - (after.x - curr.x) / 6,
        y: next.y - (after.y - curr.y) / 6,
      },
      p3: next,
    });
  }

  return segs;
}

function derivativeMagnitude(seg: CubicSegment, t: number): number {
  const mt = 1 - t;
  const dx =
    3 * mt * mt * (seg.p1.x - seg.p0.x) +
    6 * mt * t * (seg.p2.x - seg.p1.x) +
    3 * t * t * (seg.p3.x - seg.p2.x);
  const dy =
    3 * mt * mt * (seg.p1.y - seg.p0.y) +
    6 * mt * t * (seg.p2.y - seg.p1.y) +
    3 * t * t * (seg.p3.y - seg.p2.y);
  return Math.sqrt(dx * dx + dy * dy);
}

function approximateSegmentLength(seg: CubicSegment, steps = 200): number {
  const dt = 1 / steps;
  let length = 0;
  for (let i = 0; i < steps; i++) {
    const t0 = i * dt;
    const t1 = t0 + dt;
    length +=
      0.5 * dt * (derivativeMagnitude(seg, t0) + derivativeMagnitude(seg, t1));
  }
  return length;
}

function buildSvgPath(segs: CubicSegment[]): string {
  const first = segs[0]!;
  let d = `M ${first.p0.x} ${first.p0.y}`;
  for (const seg of segs) {
    d += ` C ${seg.p1.x} ${seg.p1.y} ${seg.p2.x} ${seg.p2.y} ${seg.p3.x} ${seg.p3.y}`;
  }
  return d;
}

function buildMapPathData(): MapPathData {
  const segments = buildSegments(WAYPOINTS);
  const segmentLengths = segments.map(approximateSegmentLength);
  const totalLength = segmentLengths.reduce((a, b) => a + b, 0);
  return {
    segments,
    segmentLengths,
    totalLength,
    svgPathD: buildSvgPath(segments),
  };
}

export const MAP_PATH_DATA: MapPathData = buildMapPathData();

export const WAYPOINT_LABELS = [
  'Harbor',
  'Forest',
  'Mountain Pass',
  'Castle',
  'Peak',
  'Treasure',
] as const;
