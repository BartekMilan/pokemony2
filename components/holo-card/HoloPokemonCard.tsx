import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';

import { SAMPLE_CARD } from './constants/cardContent';
import {
  CARD_BORDER_RADIUS,
  CARD_H,
  CARD_W,
  PERSPECTIVE,
} from './constants/cardLayout';
import { useCardTilt } from './hooks/useCardTilt';
import { BackgroundLayer } from './layers/BackgroundLayer';
import { FrameLayer } from './layers/FrameLayer';
import { HoloGlareLayer } from './layers/HoloGlareLayer';
import { PokemonLayer } from './layers/PokemonLayer';

export function HoloPokemonCard() {
  const tilt = useCardTilt();

  const shellStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: PERSPECTIVE },
      { rotateX: `${tilt.rotateX.value}deg` },
      { rotateY: `${tilt.rotateY.value}deg` },
    ],
  }));

  const card = (
    <View style={styles.perspectiveWrapper}>
      <Animated.View style={[styles.cardShell, shellStyle]}>
        <View style={styles.cardClip}>
          <BackgroundLayer tilt={tilt} content={SAMPLE_CARD} />
          <PokemonLayer tilt={tilt} content={SAMPLE_CARD} />
          <FrameLayer tilt={tilt} content={SAMPLE_CARD} />
          <HoloGlareLayer tilt={tilt} />
        </View>
      </Animated.View>
    </View>
  );

  return (
    <View style={styles.container}>
      {!tilt.isAvailable && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Tilt requires a physical device</Text>
          {__DEV__ && tilt.devPanGesture && (
            <Text style={styles.bannerHint}>Drag the card below to mock tilt</Text>
          )}
        </View>
      )}

      {__DEV__ && !tilt.isAvailable && tilt.devPanGesture ? (
        <GestureDetector gesture={tilt.devPanGesture}>{card}</GestureDetector>
      ) : (
        card
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    backgroundColor: 'rgba(255,193,7,0.15)',
    borderColor: 'rgba(255,193,7,0.45)',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
    maxWidth: CARD_W + 40,
  },
  bannerText: {
    color: '#ffc107',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  bannerHint: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
  perspectiveWrapper: {
    width: CARD_W,
    height: CARD_H,
  },
  cardShell: {
    width: CARD_W,
    height: CARD_H,
    backfaceVisibility: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.55,
        shadowRadius: 20,
      },
      android: {
        elevation: 16,
      },
      default: {},
    }),
  },
  cardClip: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: CARD_BORDER_RADIUS,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
  },
});
