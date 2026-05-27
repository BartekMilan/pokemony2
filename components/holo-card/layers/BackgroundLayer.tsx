import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import {
  BACKGROUND_PARALLAX,
  CARD_BORDER_RADIUS,
  CARD_H,
  CARD_W,
  PARALLAX_X_RANGE,
  PARALLAX_Y_RANGE,
} from '../constants/cardLayout';
import { TYPE_COLORS } from '../constants/cardContent';
import type { CardContent } from '../constants/cardContent';
import type { CardTiltValues } from '../types/CardTilt';

type Props = {
  tilt: CardTiltValues;
  content: CardContent;
};

/** Layer 0 — elemental gradient background, slowest parallax (0.3×). */
export function BackgroundLayer({ tilt, content }: Props) {
  const colors = TYPE_COLORS[content.type];

  const parallaxStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tilt.parallaxX.value * PARALLAX_X_RANGE * BACKGROUND_PARALLAX.x },
      { translateY: tilt.parallaxY.value * PARALLAX_Y_RANGE * BACKGROUND_PARALLAX.y },
    ],
  }));

  return (
    <Animated.View style={[styles.layer, parallaxStyle]} pointerEvents="none">
      <View style={[styles.gradientTop, { backgroundColor: colors.primary }]} />
      <View style={[styles.gradientMid, { backgroundColor: colors.secondary }]} />
      <View style={[styles.gradientBottom, { backgroundColor: colors.accent, opacity: 0.6 }]} />
      <View style={styles.rays}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.ray,
              {
                backgroundColor: colors.accent,
                transform: [{ rotate: `${i * 30}deg` }],
              },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CARD_BORDER_RADIUS,
    overflow: 'hidden',
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: CARD_H * 0.45,
  },
  gradientMid: {
    position: 'absolute',
    top: CARD_H * 0.3,
    left: 0,
    right: 0,
    height: CARD_H * 0.35,
    opacity: 0.85,
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: CARD_H * 0.4,
  },
  rays: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.15,
  },
  ray: {
    position: 'absolute',
    width: CARD_W * 0.15,
    height: CARD_H * 1.2,
  },
});
