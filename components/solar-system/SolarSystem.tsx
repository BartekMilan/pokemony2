import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { SOLAR_SYSTEM_PLANETS } from '../../data/planets';
import { Planet } from './Planet';
import { Sun } from './Sun';

export function SolarSystem() {
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.anchor,
          {
            left: width / 2,
            top: height / 2,
          },
        ]}
      >
        {SOLAR_SYSTEM_PLANETS.map((planet) => (
          <Planet key={planet.id} config={planet} />
        ))}
        <Sun />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  anchor: {
    position: 'absolute',
  },
});
