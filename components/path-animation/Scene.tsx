import { Canvas, Group } from '@shopify/react-native-skia';
import { useSharedValue, useDerivedValue } from 'react-native-reanimated';
import type { SkSize } from '@shopify/react-native-skia';
import { WAYPOINTS, WAYPOINT_PROGRESS, CANVAS_WIDTH, CANVAS_HEIGHT } from './data/pathDefinition';
import { useDrawProgress } from './hooks/useDrawProgress';
import { Background } from './layers/Background';
import { CometGlow } from './layers/CometGlow';
import { DrawnPath } from './layers/DrawnPath';
import { GlowTrail } from './layers/GlowTrail';
import { LeadingDot } from './layers/LeadingDot';
import { WaypointFlare } from './layers/WaypointFlare';

export function Scene() {
  const progress = useDrawProgress();
  const canvasSize = useSharedValue<SkSize>({ width: 0, height: 0 });

  const transform = useDerivedValue(() => {
    const { width, height } = canvasSize.value;
    if (width === 0 || height === 0) return [];
    const scale = Math.max(width / CANVAS_WIDTH, height / CANVAS_HEIGHT);
    const tx = (width - CANVAS_WIDTH * scale) / 2;
    const ty = (height - CANVAS_HEIGHT * scale) / 2;
    return [{ translateX: tx }, { translateY: ty }, { scale }];
  });

  return (
    <Canvas style={{ flex: 1 }} onSize={canvasSize}>
      <Group transform={transform}>
        <Background />
        <GlowTrail progress={progress} />
        <CometGlow progress={progress} />
        <DrawnPath progress={progress} />
        {WAYPOINTS.map((wp, i) => (
          <WaypointFlare
            key={wp.label}
            progress={progress}
            position={{ x: wp.x, y: wp.y }}
            triggerAt={WAYPOINT_PROGRESS[i]}
          />
        ))}
        <LeadingDot progress={progress} />
      </Group>
    </Canvas>
  );
}
