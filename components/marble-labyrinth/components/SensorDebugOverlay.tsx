import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { SharedValue, Value3D } from 'react-native-reanimated';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';

type Props = {
  sensor: SharedValue<Value3D>;
};

type DebugValues = {
  x: number;
  y: number;
  z: number;
};

export function SensorDebugOverlay({ sensor }: Props) {
  const [values, setValues] = useState<DebugValues>({ x: 0, y: 0, z: 0 });

  const updateValues = useCallback((x: number, y: number, z: number) => {
    setValues({ x, y, z });
  }, []);

  // REANIMATED: useAnimatedReaction — bridge sensor readings to JS for debug HUD
  useAnimatedReaction(
    () => sensor.value,
    (current) => {
      runOnJS(updateValues)(current.x, current.y, current.z);
    },
  );

  return (
    <View style={styles.overlay}>
      <Text style={styles.title}>Gravity (m/s²)</Text>
      <Text style={styles.row}>x: {values.x.toFixed(2)}</Text>
      <Text style={styles.row}>y: {values.y.toFixed(2)}</Text>
      <Text style={styles.row}>z: {values.z.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 8,
    padding: 12,
  },
  title: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 6,
  },
  row: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 14,
  },
});
