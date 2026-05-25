import { StatusBar } from 'expo-status-bar';

import { Keyboard } from '../../components/keyboard/Keyboard';

export default function KeyboardScreen() {
  return (
    <>
      <Keyboard />
      <StatusBar style="light" />
    </>
  );
}
