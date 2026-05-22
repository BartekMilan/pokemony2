import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PlanetConfig } from '../../types/planet';

type PlanetFocusOverlayProps = {
  planet: PlanetConfig;
  onBack: () => void;
};

export function PlanetFocusOverlay({ planet, onBack }: PlanetFocusOverlayProps) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.card}>
        <Text style={styles.name}>{planet.name}</Text>
        <Text style={styles.meta}>
          Orbital period · {planet.orbitalPeriodDays.toLocaleString()} days
        </Text>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back to system</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 56,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(8, 12, 28, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: 6,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  meta: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontSize: 14,
    fontWeight: '500',
  },
  backButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 200, 80, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 80, 0.45)',
  },
  backButtonText: {
    color: '#FFE4A8',
    fontSize: 14,
    fontWeight: '600',
  },
});
