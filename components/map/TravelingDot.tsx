import Animated, { useAnimatedProps } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { Circle } from 'react-native-svg';
import { getPointOnPath } from './bezierUtils';
import { MAP_PATH_DATA } from './mapData';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  progress: SharedValue<number>;
};

export default function TravelingDot({ progress }: Props) {
  const animatedProps = useAnimatedProps(() => {
    const pt = getPointOnPath(progress.value, MAP_PATH_DATA);
    return { cx: pt.x, cy: pt.y };
  });

  return (
    <AnimatedCircle
      animatedProps={animatedProps}
      r={6}
      fill="#cc3333"
      stroke="#fff"
      strokeWidth={1.5}
    />
  );
}
