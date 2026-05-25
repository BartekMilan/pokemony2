import { useRef } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useKeyboardHandler } from 'react-native-keyboard-controller';

import { Pikachu } from './Pikachu';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const KEYBOARD_GAP = 12;

function computeTranslateY(keyboardHeight: number, inputBottomY: number) {
  'worklet';
  return Math.min(
    0,
    SCREEN_HEIGHT - keyboardHeight - inputBottomY - KEYBOARD_GAP,
  );
}

export function Keyboard() {
  const measureRef = useRef<View>(null);
  const inputBottomY = useSharedValue(0);
  const translateY = useSharedValue(0);

  const measureInput = () => {
    measureRef.current?.measureInWindow((_x, y, _width, height) => {
      inputBottomY.value = y + height;
    });
  };

  useKeyboardHandler(
    {
      onStart: (e) => {
        'worklet';
        translateY.value = computeTranslateY(e.height, inputBottomY.value);
      },
      onMove: (e) => {
        'worklet';
        translateY.value = computeTranslateY(e.height, inputBottomY.value);
      },
      onEnd: (e) => {
        'worklet';
        translateY.value = computeTranslateY(e.height, inputBottomY.value);
      },
    },
    [],
  );

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View
          ref={measureRef}
          style={styles.inputWrapper}
          onLayout={measureInput}>
          <Animated.View style={inputAnimatedStyle}>
            <TextInput
              style={styles.input}
              placeholder="Tap to type"
              placeholderTextColor="#666"
              selectionColor="#fff"
              showSoftInputOnFocus
              autoCorrect={false}
              onFocus={measureInput}
            />
          </Animated.View>
          <View style={styles.pikachuContainer} pointerEvents="none">
            <Pikachu size={72} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 160,
  },
  inputWrapper: {
    width: '80%',
    maxWidth: 320,
    marginTop: 144,
  },
  pikachuContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 8,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#111',
  },
  devHint: {
    marginTop: 8,
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
});
