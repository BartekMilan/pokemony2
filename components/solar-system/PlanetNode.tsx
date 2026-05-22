import {
  BlurMask,
  Circle,
  Group,
  Image,
  Path,
  RadialGradient,
  Skia,
  vec,
  type SkImage,
} from '@shopify/react-native-skia';
import { useDerivedValue, type DerivedValue } from 'react-native-reanimated';

import type { PlanetSlotState } from './PlanetRenderSlot';

type PlanetNodeProps = {
  planetIndex: number;
  texture: SkImage | null;
  fallbackColor: string;
  hasRings: boolean;
  hasAtmosphere: boolean;
  slot: DerivedValue<PlanetSlotState>;
};

export function PlanetNode({
  planetIndex,
  texture,
  fallbackColor,
  hasRings,
  hasAtmosphere,
  slot,
}: PlanetNodeProps) {
  const visible = useDerivedValue(() =>
    slot.value.planetIndex === planetIndex ? slot.value.opacity : 0,
  );

  const cx = useDerivedValue(() => slot.value.cx);
  const cy = useDerivedValue(() => slot.value.cy);
  const r = useDerivedValue(() => slot.value.r);

  const spinTransform = useDerivedValue(() => {
    'worklet';
    const { cx: centerX, cy: centerY, spinAngle } = slot.value;
    return [
      { translateX: centerX },
      { translateY: centerY },
      { rotate: spinAngle },
      { translateX: -centerX },
      { translateY: -centerY },
    ];
  });

  const clipPath = useDerivedValue(() => {
    'worklet';
    const { cx: centerX, cy: centerY, r: radius } = slot.value;
    const path = Skia.Path.Make();
    path.addCircle(centerX, centerY, radius);
    return path;
  });

  const imageX = useDerivedValue(() => slot.value.cx - slot.value.r);
  const imageY = useDerivedValue(() => slot.value.cy - slot.value.r);
  const imageSize = useDerivedValue(() => slot.value.r * 2);

  const glassHighlight = useDerivedValue(() =>
    vec(slot.value.cx - slot.value.r * 0.32, slot.value.cy - slot.value.r * 0.34),
  );
  const glassRadius = useDerivedValue(() => slot.value.r * 1.35);

  const specularCx = useDerivedValue(() => slot.value.cx - slot.value.r * 0.34);
  const specularCy = useDerivedValue(() => slot.value.cy - slot.value.r * 0.36);
  const specularR = useDerivedValue(() => slot.value.r * 0.16);

  const atmosphereR = useDerivedValue(() => slot.value.r * 1.22);
  const atmosphereColor = useDerivedValue(() =>
    planetIndex === 1 ? 'rgba(255, 220, 160, 0.28)' : 'rgba(100, 180, 255, 0.32)',
  );

  const ringPath = useDerivedValue(() => {
    'worklet';
    const { cx: centerX, cy: centerY, r: radius } = slot.value;
    const path = Skia.Path.Make();
    path.addOval({
      x: centerX - radius * 1.78,
      y: centerY - radius * 0.4,
      width: radius * 3.56,
      height: radius * 0.8,
    });
    return path;
  });

  const ringStroke = useDerivedValue(() => Math.max(0.8, slot.value.r * 0.11));

  return (
    <Group opacity={visible}>
      {hasAtmosphere ? (
        <Circle cx={cx} cy={cy} r={atmosphereR} color={atmosphereColor}>
          <BlurMask blur={4} style="normal" respectCTM />
        </Circle>
      ) : null}

      {hasRings ? (
        <Path
          path={ringPath}
          style="stroke"
          strokeWidth={ringStroke}
          color="rgba(210, 185, 140, 0.55)"
        />
      ) : null}

      <Group clip={clipPath}>
        <Group transform={spinTransform}>
          {texture ? (
            <Image
              image={texture}
              x={imageX}
              y={imageY}
              width={imageSize}
              height={imageSize}
              fit="cover"
            />
          ) : (
            <Circle cx={cx} cy={cy} r={r} color={fallbackColor} />
          )}
        </Group>

        <Circle cx={cx} cy={cy} r={r}>
          <RadialGradient
            c={glassHighlight}
            r={glassRadius}
            colors={[
              'rgba(255,255,255,0.42)',
              'rgba(255,255,255,0.08)',
              'rgba(0,0,0,0.38)',
            ]}
            positions={[0, 0.42, 1]}
          />
        </Circle>

        <Circle
          cx={specularCx}
          cy={specularCy}
          r={specularR}
          color="rgba(255,255,255,0.58)"
        />
      </Group>
    </Group>
  );
}
