import { Platform, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { CARD_BORDER_RADIUS, CARD_H, CARD_W, GLARE_OPACITY } from '../constants/cardLayout';
import type { CardTiltValues } from '../types/CardTilt';

type Props = {
  tilt: CardTiltValues;
};

/** Layer 3 — holographic foil sweep driven by atan2(pitch, roll). */
export function HoloGlareLayer({ tilt }: Props) {
  const glareStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tilt.glareTranslate.value },
      { rotate: `${tilt.glareAngle.value}rad` },
    ],
  }));

  return (
    <Animated.View
      style={[styles.layer, glareStyle, Platform.OS === 'ios' && styles.blendScreen]}
      pointerEvents="none">
      <Svg width={CARD_W * 2} height={CARD_H} style={styles.svg}>
        <Defs>
          <LinearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <Stop offset="25%" stopColor="#00e5ff" stopOpacity="0.9" />
            <Stop offset="50%" stopColor="#e040fb" stopOpacity="0.85" />
            <Stop offset="75%" stopColor="#ffeb3b" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity="0.7" />
          </LinearGradient>
        </Defs>
        <Rect
          x={-CARD_W * 0.25}
          y={0}
          width={CARD_W * 0.55}
          height={CARD_H}
          fill="url(#holoGradient)"
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CARD_BORDER_RADIUS,
    overflow: 'hidden',
    opacity: Platform.OS === 'android' ? GLARE_OPACITY + 0.1 : GLARE_OPACITY,
  },
  blendScreen: {
    mixBlendMode: 'screen',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: -CARD_W * 0.5,
  },
});
