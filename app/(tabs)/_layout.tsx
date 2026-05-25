import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#111' },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
      }}>
      <Tabs.Screen name="index" options={{ title: 'Solar System' }} />
      <Tabs.Screen name="line" options={{ title: 'Line' }} />
      <Tabs.Screen name="playground" options={{ title: 'Ball' }} />
      <Tabs.Screen name="keyboard" options={{ title: 'Keyboard' }} />
      <Tabs.Screen name="gallery" options={{ title: 'Gallery' }} />
    </Tabs>
  );
}
