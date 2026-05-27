import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import {
  CARD_BORDER_RADIUS,
  CARD_H,
  CARD_W,
  PARALLAX_X_RANGE,
  PARALLAX_Y_RANGE,
  POKEMON_PARALLAX,
  POKEMON_SCALE,
} from '../constants/cardLayout';
import type { CardContent } from '../constants/cardContent';
import type { CardTiltValues } from '../types/CardTilt';

type Props = {
  tilt: CardTiltValues;
  content: CardContent;
};

const POKEMON_EMOJI: Record<CardContent['type'], string> = {
  fire: '🔥',
  water: '💧',
  grass: '🌿',
  electric: '⚡',
};

/** Layer 1 — Pokémon art placeholder, fastest parallax (0.8×). */
export function PokemonLayer({ tilt, content }: Props) {
  const parallaxStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tilt.parallaxX.value * PARALLAX_X_RANGE * POKEMON_PARALLAX.x },
      { translateY: tilt.parallaxY.value * PARALLAX_Y_RANGE * POKEMON_PARALLAX.y },
      { scale: POKEMON_SCALE },
    ],
  }));

  return (
    <Animated.View style={[styles.layer, parallaxStyle]} pointerEvents="none">
      <View style={styles.artArea}>
        <Text style={styles.emoji}>{POKEMON_EMOJI[content.type]}</Text>
        <Text style={styles.silhouetteLabel}>{content.name}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CARD_BORDER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artArea: {
    width: CARD_W * 0.75,
    height: CARD_H * 0.42,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -CARD_H * 0.06,
  },
  emoji: {
    fontSize: 96,
    lineHeight: 110,
  },
  silhouetteLabel: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
