import { StatusBar } from 'expo-status-bar';

import { GameScreen } from '../../components/marble-labyrinth/GameScreen';

export default function MarbleScreen() {
  return (
    <>
      <GameScreen />
      <StatusBar style="light" />
    </>
  );
}
