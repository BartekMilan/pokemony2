import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GalleryImage } from '../../../components/gallery/GalleryImage';
import { getGalleryItem } from '../../../constants/gallery';
import {
  DETAIL_CONTENT_ENTER_DELAY_MS,
  galleryImageTransition,
} from '../../../constants/galleryTransition';

export default function GalleryDetailScreen() {
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const item = id ? getGalleryItem(id) : undefined;

  if (!item) {
    return (
      <View style={styles.container}>
        <View style={styles.fallbackContent}>
          <Text style={styles.fallbackTitle}>Photo not found</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GalleryImage
        source={item.image}
        sharedTransitionTag={`landscape-${item.id}`}
        sharedTransitionStyle={galleryImageTransition}
        style={styles.heroImage}
        resizeMode="cover"
      />
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentScrollInner}
        showsVerticalScrollIndicator={false}>
        <Animated.View
          entering={FadeInDown.delay(DETAIL_CONTENT_ENTER_DELAY_MS).duration(380)}
          style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go back</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroImage: {
    width: '100%',
    height: 300,
    borderRadius: 0,
  },
  contentScroll: {
    flex: 1,
  },
  contentScrollInner: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444444',
    marginBottom: 28,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#111111',
    backgroundColor: '#FFFFFF',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },
  fallbackContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 20,
  },
});
