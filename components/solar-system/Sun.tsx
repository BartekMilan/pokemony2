import { Circle, RadialGradient, Stop } from 'react-native-svg';

export function SunGradientDef() {
  return (
    <RadialGradient id="sunGradient" cx="35%" cy="32%" fx="30%" fy="28%" r="50%">
      <Stop offset="0%"   stopColor="#fffde7" />
      <Stop offset="20%"  stopColor="#fff176" />
      <Stop offset="55%"  stopColor="#FDB813" />
      <Stop offset="80%"  stopColor="#e67e22" />
      <Stop offset="100%" stopColor="#a04000" />
    </RadialGradient>
  );
}

export function SunCircle() {
  return <Circle cx={210} cy={110} r={110} fill="url(#sunGradient)" />;
}
