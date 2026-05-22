import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

const TIME_WARP_OPTIONS = [
  { label: '1×', value: 1 },
  { label: '10×', value: 10 },
  { label: '50×', value: 50 },
] as const;

type TimeWarpControlsProps = {
  speedMultiplier: SharedValue<number>;
  activeSpeed: number;
  onSelectSpeed: (speed: number) => void;
};

export function TimeWarpControls({
  speedMultiplier,
  activeSpeed,
  onSelectSpeed,
}: TimeWarpControlsProps) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <Text style={styles.label}>Time warp</Text>
      <View style={styles.row}>
        {TIME_WARP_OPTIONS.map((option) => {
          const isActive = activeSpeed === option.value;

          return (
            <Pressable
              key={option.label}
              style={[styles.button, isActive && styles.buttonActive]}
              onPress={() => {
                speedMultiplier.value = option.value;
                onSelectSpeed(option.value);
              }}
            >
              <Text style={[styles.buttonText, isActive && styles.buttonTextActive]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 28,
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    minWidth: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  buttonActive: {
    backgroundColor: 'rgba(255, 200, 80, 0.2)',
    borderColor: 'rgba(255, 200, 80, 0.55)',
  },
  buttonText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextActive: {
    color: '#FFE4A8',
  },
});
