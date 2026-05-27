import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import {
  CARD_BORDER_RADIUS,
  CARD_H,
  CARD_W,
  FRAME_PARALLAX,
  PARALLAX_X_RANGE,
  PARALLAX_Y_RANGE,
} from '../constants/cardLayout';
import { TYPE_COLORS } from '../constants/cardContent';
import type { CardContent } from '../constants/cardContent';
import type { CardTiltValues } from '../types/CardTilt';

type Props = {
  tilt: CardTiltValues;
  content: CardContent;
};

/** Layer 2 — frame, name, HP, attacks. Locked to card edge (0× parallax). */
export function FrameLayer({ tilt, content }: Props) {
  const colors = TYPE_COLORS[content.type];

  const parallaxStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tilt.parallaxX.value * PARALLAX_X_RANGE * FRAME_PARALLAX.x },
      { translateY: tilt.parallaxY.value * PARALLAX_Y_RANGE * FRAME_PARALLAX.y },
    ],
  }));

  return (
    <Animated.View style={[styles.layer, parallaxStyle]} pointerEvents="none">
      <View style={[styles.border, { borderColor: colors.accent }]} />

      <View style={styles.header}>
        <Text style={styles.stage}>{content.stage}</Text>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{content.name}</Text>
          <View style={[styles.hpBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.hpLabel}>HP</Text>
            <Text style={styles.hpValue}>{content.hp}</Text>
          </View>
        </View>
      </View>

      <View style={styles.attackSection}>
        {content.attacks.map((attack) => (
          <View key={attack.name} style={styles.attackRow}>
            <View style={styles.attackHeader}>
              <Text style={styles.attackName}>{attack.name}</Text>
              <Text style={styles.attackDamage}>{attack.damage}</Text>
            </View>
            <Text style={styles.attackDesc}>{attack.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>weakness {content.weakness}</Text>
        <Text style={styles.footerText}>resistance {content.resistance}</Text>
        <Text style={styles.footerText}>retreat {content.retreat}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CARD_BORDER_RADIUS,
    padding: 12,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CARD_BORDER_RADIUS,
    borderWidth: 3,
  },
  header: {
    marginTop: 4,
  },
  stage: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  hpBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  hpLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
  },
  hpValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  attackSection: {
    position: 'absolute',
    bottom: 52,
    left: 12,
    right: 12,
    gap: 10,
  },
  attackRow: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 8,
    padding: 8,
  },
  attackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  attackName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  attackDamage: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffeb3b',
  },
  attackDesc: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '600',
  },
});
