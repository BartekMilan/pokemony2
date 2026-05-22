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
  const initialSpinAngle = config.initialSpinAngle ?? 0;
  const half = config.size / 2;
  const markerSize = Math.max(4, config.size * 0.22);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${time.value * config.angularVelocity + initialAngle}rad`,
      },
      { 
        translateX: config.orbitRadius
      },
      {
        rotate: `${time.value * config.spinVelocity + initialSpinAngle}rad`,
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.planet,
        animatedStyle,
        {
          width: config.size,
          height: config.size,
          borderRadius: half,
          marginLeft: -half,
          marginTop: -half,
          backgroundColor: config.color,
        },
      ]}
    >
      <View
        style={[
          styles.spinMarker,
          {
            width: markerSize,
            height: markerSize,
            borderRadius: markerSize / 2,
            top: config.size * 0.12,
            marginLeft: -markerSize / 2,
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  planet: {
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden',
  },
  spinMarker: {
    position: 'absolute',
    left: '50%',
    backgroundColor: '#FFFFFF',
  },
});
