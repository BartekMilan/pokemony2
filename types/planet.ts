export type PlanetConfig = {
  id: string;
  name?: string;
  orbitRadius: number;
  angularVelocity: number;
  spinVelocity: number;
  size: number;
  color: string;
  initialAngle?: number;
  initialSpinAngle?: number;
};
