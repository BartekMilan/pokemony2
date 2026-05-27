import { BlurMask, Group, Path, Skia } from '@shopify/react-native-skia';
import { type SharedValue, useDerivedValue } from 'react-native-reanimated';
import { PATH_D } from '../data/pathDefinition';

export function CometGlow({
  progress,
  windowSize = 0.08,
}: { progress: SharedValue<number>; windowSize?: number }) {
  const cometPath = useDerivedValue(() => {
    const p = Skia.Path.MakeFromSVGString(PATH_D)!.copy();
    const end = progress.value;
    const start = Math.max(0, end - windowSize);
    // Edge case: when progress is exactly 0, start === end and trim would be empty.
    if (end <= 0) return Skia.Path.Make();
    p.trim(start, end, false);
    return p;
  });

  return (
    <Group blendMode="plus">
      <Path
        path={cometPath}
        style="stroke"
        strokeWidth={18}
        color="#ffd66b"
        opacity={0.9}
        strokeCap="round"
        strokeJoin="round"
      >
        <BlurMask blur={22} style="solid" />
      </Path>
    </Group>
  );
}
