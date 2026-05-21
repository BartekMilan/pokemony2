import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const width = useSharedValue(120);
  const [label, setLabel] = useState('Reanimated 4 ready');

  const boxStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>pokemony2</Text>
      <Text style={styles.subtitle}>{label}</Text>
      <Animated.View style={[styles.box, boxStyle]} />
      <Pressable
        style={styles.button}
        onPress={() => {
          width.value = withTiming(80 + Math.random() * 220, {
            duration: 500,
            easing: Easing.bezier(0.5, 0.01, 0, 1),
          });
          setLabel('Animated with Reanimated 4');
        }}
      >
        <Text style={styles.buttonText}>Animate</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 32,
  },
  box: {
    height: 80,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#111827',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
