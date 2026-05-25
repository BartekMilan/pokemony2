import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GalleryImage } from '../../../components/gallery/GalleryImage';
import { GALLERY_ITEMS } from '../../../constants/gallery';
import { galleryImageTransition } from '../../../constants/galleryTransition';

export default function GalleryScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Tatra Mountains</Text>
        {GALLERY_ITEMS.map((item) => (
          <View key={item.id} style={styles.card}>
            <Pressable
              onPress={() => router.push(`/gallery/${item.id}`)}
              style={({ pressed }) => [styles.cardPressable, pressed && styles.cardPressed]}>
              <GalleryImage
                source={item.image}
                sharedTransitionTag={`landscape-${item.id}`}
                sharedTransitionStyle={galleryImageTransition}
                style={styles.cardImage}
                resizeMode="cover"
              />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 32,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 24,
  },
  card: {
    marginBottom: 20,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressable: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.92,
  },
  cardImage: {
    width: '100%',
    height: 240,
    borderRadius: 14,
  },
});
