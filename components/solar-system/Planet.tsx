import Animated, { useAnimatedProps } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { Circle, RadialGradient, Stop } from 'react-native-svg';
import type { PlanetConfig } from '../../types/planet';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Plain literals required — Reanimated worklets cannot import module-scope constants
const SIN_TILT = 0.27564;
const COS_TILT = 0.96126;
const ORBIT_RADIUS = 250;
const SVG_CENTER_X = 210;
const SVG_CENTER_Y = 110;
const PERSPECTIVE = 0.30;

interface Props {
  config: PlanetConfig;
  time: SharedValue<number>;
}

export function EarthGradientDef() {
  return (
    <RadialGradient id="earthGradient" cx="35%" cy="30%" fx="25%" fy="22%" r="50%">
      <Stop offset="0%"   stopColor="#e8f4ff" />
      <Stop offset="18%"  stopColor="#6ab4f5" />
      <Stop offset="45%"  stopColor="#2979c8" />
      <Stop offset="72%"  stopColor="#1a5fa0" />
      <Stop offset="100%" stopColor="#060e1c" />
    </RadialGradient>
  );
}

export function EarthBehindCircle({ config, time }: Props) {
  const animatedProps = useAnimatedProps(() => {
    'worklet';
    const angle = time.value * config.angularVelocity + (config.initialAngle ?? 0);
    const x3d = ORBIT_RADIUS * Math.cos(angle);
    const z3d = ORBIT_RADIUS * Math.sin(angle);
    const depth = z3d * COS_TILT;
    const scale = 1 + (depth / ORBIT_RADIUS) * PERSPECTIVE;
    const radius = (config.size / 2) * scale;
    return {
      cx: SVG_CENTER_X + x3d,
      cy: SVG_CENTER_Y + (-z3d * SIN_TILT),
      r: radius,
      opacity: depth <= 0 ? 1 : 0,
    };
  });
  return <AnimatedCircle animatedProps={animatedProps} fill="url(#earthGradient)" />;
}

export function EarthFrontCircle({ config, time }: Props) {
  const animatedProps = useAnimatedProps(() => {
    'worklet';
    const angle = time.value * config.angularVelocity + (config.initialAngle ?? 0);
    const x3d = ORBIT_RADIUS * Math.cos(angle);
    const z3d = ORBIT_RADIUS * Math.sin(angle);
    const depth = z3d * COS_TILT;
    const scale = 1 + (depth / ORBIT_RADIUS) * PERSPECTIVE;
    const radius = (config.size / 2) * scale;
    return {
      cx: SVG_CENTER_X + x3d,
      cy: SVG_CENTER_Y + (-z3d * SIN_TILT),
      r: radius,
      opacity: depth > 0 ? 1 : 0,
    };
  });
  return <AnimatedCircle animatedProps={animatedProps} fill="url(#earthGradient)" />;
}
