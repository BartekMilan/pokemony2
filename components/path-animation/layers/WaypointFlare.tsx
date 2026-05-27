import { BlurMask, Circle, Group } from '@shopify/react-native-skia';
import { type SharedValue, useDerivedValue } from 'react-native-reanimated';

const APPROACH = 0.06;
const DECAY = 0.07;
const MAX_R = 18;
const BASE_R = 4;

export function WaypointFlare({
  progress,
  position,
  triggerAt,
}: {
  progress: SharedValue<number>;
  position: { x: number; y: number };
  triggerAt: number;
}) {
  const phase = useDerivedValue(() => {
    const d = progress.value - triggerAt;
    if (d < -APPROACH || d > DECAY) return 0;
    if (d <= 0) return (d + APPROACH) / APPROACH; // approach: −APPROACH→0 ⇒ 0→1
    return 1 - d / DECAY; // decay: 0→DECAY ⇒ 1→0
  });

  const radius = useDerivedValue(() => BASE_R + phase.value * (MAX_R - BASE_R));
  const opacity = useDerivedValue(() => phase.value);

  return (
    <Group>
      <Circle cx={position.x} cy={position.y} r={radius} opacity={opacity} color="#ffe28a">
        <BlurMask blur={8} style="solid" />
      </Circle>
    </Group>
  );
}
