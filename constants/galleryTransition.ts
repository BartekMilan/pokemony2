import { SharedTransition } from 'react-native-reanimated';

/** Smooth grow from gallery card → detail hero (same image, larger). */
export const galleryImageTransition = SharedTransition.duration(450).springify();

/** Detail text fades in after the hero has mostly expanded. */
export const DETAIL_CONTENT_ENTER_DELAY_MS = 280;
