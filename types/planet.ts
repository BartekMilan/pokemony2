export type PlanetConfig = {
  id: string;
  name: string;
  orbitalPeriodDays: number;
  orbitRadius: number;
  /** Orbital plane tilt in radians (0 = edge-on from top). */
  orbitInclination: number;
  angularVelocity: number;
  spinVelocity: number;
  size: number;
  color: string;
  initialAngle?: number;
  initialSpinAngle?: number;
  texture?: number;
  rings?: boolean;
  atmosphere?: boolean;
};
