import { StyleSheet, View } from 'react-native';

import type { Goal, Wall } from '../types/level';

type Props = {
  walls: Wall[];
  goal: Goal;
};

export function MazeRenderer({ walls, goal }: Props) {
  return (
    <>
      {walls.map((wall, index) => (
        <View
          key={index}
          style={[
            styles.wall,
            {
              left: wall.x,
              top: wall.y,
              width: wall.w,
              height: wall.h,
            },
          ]}
        />
      ))}
      <View
        style={[
          styles.goal,
          {
            left: goal.x - goal.r,
            top: goal.y - goal.r,
            width: goal.r * 2,
            height: goal.r * 2,
            borderRadius: goal.r,
          },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  wall: {
    position: 'absolute',
    backgroundColor: '#2a2a2a',
  },
  goal: {
    position: 'absolute',
    backgroundColor: '#27ae60',
    opacity: 0.6,
  },
});
