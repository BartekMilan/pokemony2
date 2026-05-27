import Animated, { useAnimatedProps } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { Path } from 'react-native-svg';
import { MAP_PATH_DATA } from './mapData';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type Props = {
  progress: SharedValue<number>;
};

export default function RoutePath({ progress }: Props) {
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: MAP_PATH_DATA.totalLength * (1 - progress.value),
  }));

  return (
    <AnimatedPath
      animatedProps={animatedProps}
      d={MAP_PATH_DATA.svgPathD}
      fill="none"
      stroke="#5c3d1e"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={MAP_PATH_DATA.totalLength}
    />
  );
}
