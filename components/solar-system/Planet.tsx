import { StyleSheet, View } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import type { PlanetConfig } from '../../types/planet';

type PlanetProps = {
  config: PlanetConfig;
  time: SharedValue<number>;
};

export function Planet({ config, time }: PlanetProps) {
  const initialAngle = config.initialAngle ?? 0;
  const half = config.size / 2;

  const orbitStyle = useAnimatedStyle(() => {
    const angle = time.value * config.angularVelocity + initialAngle;

    return {
      transform: [
        { translateX: config.orbitRadius * Math.cos(angle) },
        { translateY: config.orbitRadius * Math.sin(angle) },
      ],
    };
  });

  return (
    <Animated.View style={[styles.orbitPosition, orbitStyle]}>
      <View
        style={[
          styles.planet,
          {
            width: config.size,
            height: config.size,
            borderRadius: half,
            marginLeft: -half,
            marginTop: -half,
            backgroundColor: config.color,
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  orbitPosition: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  planet: {},
});
