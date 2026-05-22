import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import type { PlanetConfig } from '../../types/planet';
import { getOrbitCssAnimation } from './orbitCssAnimation';

type PlanetProps = {
  config: PlanetConfig;
};

export function Planet({ config }: PlanetProps) {
  const half = config.size / 2;
  const orbitStyle = useMemo(
    () => ({
      ...styles.orbitArm,
      ...getOrbitCssAnimation(config),
    }),
    [config.angularVelocity, config.initialAngle]
  );

  return (
    <Animated.View style={orbitStyle}>
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
            transform: [{ translateX: config.orbitRadius }],
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  orbitArm: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  planet: {},
});
