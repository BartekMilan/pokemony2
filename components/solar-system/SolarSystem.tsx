import { View, StyleSheet } from 'react-native';
import Svg, { Defs } from 'react-native-svg';
import { useSolarSystemClock } from '../../hooks/useSolarSystemClock';
import { SOLAR_SYSTEM_PLANETS } from '../../data/planets';
import { SunGradientDef, SunCircle } from './Sun';
import { EarthGradientDef, EarthBehindCircle, EarthFrontCircle } from './Planet';
import { OrbitRingBack, OrbitRingFront } from './OrbitRings';
import StarBackground from './StarBackground';

export default function SolarSystem() {
  const time = useSolarSystemClock();
  const earth = SOLAR_SYSTEM_PLANETS[0];

  return (
    <View style={styles.container}>
      <StarBackground />
      <Svg width={420} height={220}>
        <Defs>
          <SunGradientDef />
          <EarthGradientDef />
        </Defs>
        <OrbitRingBack />
        <EarthBehindCircle config={earth} time={time} />
        <SunCircle />
        <OrbitRingFront />
        <EarthFrontCircle config={earth} time={time} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050510',
  },
});
