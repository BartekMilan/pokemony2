import { LinearGradient, Path, Skia, vec } from '@shopify/react-native-skia';
import { type SharedValue, useDerivedValue } from 'react-native-reanimated';
import { PATH_D, WAYPOINTS } from '../data/pathDefinition';

const ORIGIN = WAYPOINTS[0];
const DESTINATION = WAYPOINTS[WAYPOINTS.length - 1];
const GRADIENT_WINDOW = 0.2;

function pointAlongRoute(t: number) {
  'worklet';
  return vec(
    ORIGIN.x + (DESTINATION.x - ORIGIN.x) * t,
    ORIGIN.y + (DESTINATION.y - ORIGIN.y) * t,
  );
}

export function DrawnPath({ progress }: { progress: SharedValue<number> }) {
  const trimmedPath = useDerivedValue(() => {
    'worklet';
    const p = Skia.Path.MakeFromSVGString(PATH_D)!.copy();
    p.trim(0, progress.value, false);
    return p;
  });

  const gradientStart = useDerivedValue(() => {
    'worklet';
    return pointAlongRoute(Math.max(0, progress.value - GRADIENT_WINDOW));
  });

  const gradientEnd = useDerivedValue(() => {
    'worklet';
    return pointAlongRoute(progress.value);
  });

  return (
    <Path
      path={trimmedPath}
      style="stroke"
      strokeWidth={4}
      strokeCap="round"
      strokeJoin="round"
    >
      <LinearGradient
        start={gradientStart}
        end={gradientEnd}
        colors={['#4a9b7f', '#fff8dc', '#ffd66b']}
        positions={[0, 0.45, 1]}
      />
    </Path>
  );
}
