import { Circle } from '@shopify/react-native-skia';
import { useMemo } from 'react';

import { createStarfield } from '../../lib/solar/starfieldData';

type StarfieldProps = {
  width: number;
  height: number;
};

/** Fixed to the viewport — a stationary “window into space” while the solar system pans beneath. */
export function Starfield({ width, height }: StarfieldProps) {
  const stars = useMemo(() => createStarfield(width, height), [width, height]);

  return (
    <>
      {stars.map((star, index) => (
        <Circle
          key={index}
          cx={star.x}
          cy={star.y}
          r={star.radius}
          color={`rgba(255, 255, 255, ${star.opacity})`}
        />
      ))}
    </>
  );
}
