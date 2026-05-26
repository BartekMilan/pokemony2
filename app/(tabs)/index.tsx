import { StatusBar } from 'expo-status-bar';

import SolarSystem from '../../components/solar-system/SolarSystem';

export default function HomeScreen() {
  return (
    <>
      <SolarSystem />
      <StatusBar style="light" />
    </>
  );
}
