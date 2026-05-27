import { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg from 'react-native-svg';
import MapBackground from './MapBackground';
import RoutePath from './RoutePath';
import TravelingDot from './TravelingDot';
import WaypointMarkers from './WaypointMarkers';

const VIEW_W = 360;
const VIEW_H = 640;

export default function TreasureMap() {
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 5000,
        easing: Easing.inOut(Easing.cubic),
      }),
      -1,
      false,
    );
  }, [progress]);

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
    >
      <MapBackground />
      <RoutePath progress={progress} />
      <WaypointMarkers />
      <TravelingDot progress={progress} />
    </Svg>
  );
}
