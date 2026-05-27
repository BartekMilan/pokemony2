import type { CubicSegment, MapPathData, Point } from './mapData';

export function cubicBezierPoint(seg: CubicSegment, t: number): Point {
  'worklet';
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  return {
    x:
      mt2 * mt * seg.p0.x +
      3 * mt2 * t * seg.p1.x +
      3 * mt * t2 * seg.p2.x +
      t2 * t * seg.p3.x,
    y:
      mt2 * mt * seg.p0.y +
      3 * mt2 * t * seg.p1.y +
      3 * mt * t2 * seg.p2.y +
      t2 * t * seg.p3.y,
  };
}

export function getPointOnPath(
  globalProgress: number,
  pathData: MapPathData,
): Point {
  'worklet';
  const p = Math.min(Math.max(globalProgress, 0), 1);
  const targetLength = p * pathData.totalLength;

  let accumulated = 0;
  for (let i = 0; i < pathData.segments.length; i++) {
    const segLen = pathData.segmentLengths[i]!;
    if (accumulated + segLen >= targetLength || i === pathData.segments.length - 1) {
      const localT =
        segLen < 0.0001
          ? 0
          : Math.min((targetLength - accumulated) / segLen, 1);
      return cubicBezierPoint(pathData.segments[i]!, localT);
    }
    accumulated += segLen;
  }

  const last = pathData.segments[pathData.segments.length - 1]!;
  return last.p3;
}
