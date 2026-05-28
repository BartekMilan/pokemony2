import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

export const MARBLE_RADIUS = 14;

type Props = {
  posX: SharedValue<number>;
  posY: SharedValue<number>;
  scale: SharedValue<number>;
};

export function Marble({ posX, posY, scale }: Props) {
  // REANIMATED: useAnimatedStyle — marble + shadow transforms
  const shadowStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: posX.value - MARBLE_RADIUS + 3 },
      { translateY: posY.value - MARBLE_RADIUS + 3 },
      { scale: scale.value * 0.85 },
    ],
  }));

  const marbleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: posX.value - MARBLE_RADIUS },
      { translateY: posY.value - MARBLE_RADIUS },
      { scale: scale.value },
    ],
  }));

  return (
    <>
      <Animated.View style={[styles.shadow, shadowStyle]} />
      <Animated.View style={[styles.marble, marbleStyle]} />
    </>
  );
}

const styles = StyleSheet.create({
  shadow: {
    position: 'absolute',
    width: MARBLE_RADIUS * 2,
    height: MARBLE_RADIUS * 2,
    borderRadius: MARBLE_RADIUS,
    backgroundColor: '#000',
    opacity: 0.25,
  },
  marble: {
    position: 'absolute',
    width: MARBLE_RADIUS * 2,
    height: MARBLE_RADIUS * 2,
    borderRadius: MARBLE_RADIUS,
    backgroundColor: '#2ecc40',
  },
});
