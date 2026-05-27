import React from 'react';
import { Circle, G } from 'react-native-svg';
import { MAP_PATH_DATA } from './mapData';

export default function WaypointMarkers() {
  const start = MAP_PATH_DATA.segments[0]!.p0;
  const ends = MAP_PATH_DATA.segments.map((s) => s.p3);

  return (
    <G>
      <Circle
        cx={start.x}
        cy={start.y}
        r={5}
        fill="#f4e4c1"
        stroke="#5c3d1e"
        strokeWidth={1.5}
      />
      {ends.map((pt, i) => (
        <Circle
          key={i}
          cx={pt.x}
          cy={pt.y}
          r={5}
          fill="#f4e4c1"
          stroke="#5c3d1e"
          strokeWidth={1.5}
        />
      ))}
    </G>
  );
}
