import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { STARS } from '../../data/stars';

export default function StarBackground() {
  const { width, height } = useWindowDimensions();

  return (
    <View
      style={[StyleSheet.absoluteFillObject, { backgroundColor: '#050510' }]}
      pointerEvents="none"
    >
      <Svg width={width} height={height}>
        {STARS.map((s, i) => (
          <Circle
            key={i}
            cx={s.x * width}
            cy={s.y * height}
            r={s.r}
            fill="white"
            opacity={s.opacity}
          />
        ))}
      </Svg>
    </View>
  );
}
