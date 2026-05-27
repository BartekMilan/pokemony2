import { BlurMask, Group, Path, Skia } from '@shopify/react-native-skia';
import { type SharedValue, useDerivedValue } from 'react-native-reanimated';
import { PATH_D } from '../data/pathDefinition';

export function GlowTrail({ progress }: { progress: SharedValue<number> }) {
  const trimmedPath = useDerivedValue(() => {
    const p = Skia.Path.MakeFromSVGString(PATH_D)!.copy();
    p.trim(0, progress.value, false);
    return p;
  });

  return (
    <Group>
      <Path
        path={trimmedPath}
        style="stroke"
        strokeWidth={14}
        color="#fff8dc"
        opacity={0.35}
        strokeCap="round"
        strokeJoin="round"
      >
        <BlurMask blur={12} style="solid" />
      </Path>
    </Group>
  );
}
