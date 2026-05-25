import type { ImageProps } from 'react-native';
import Animated, { type SharedTransition } from 'react-native-reanimated';

type GalleryImageProps = ImageProps & {
  sharedTransitionTag: string;
  sharedTransitionStyle?: SharedTransition;
};

export function GalleryImage({
  sharedTransitionTag,
  sharedTransitionStyle,
  ...props
}: GalleryImageProps) {
  const imageProps = {
    ...props,
    sharedTransitionTag,
    sharedTransitionStyle,
  } as React.ComponentProps<typeof Animated.Image>;

  return <Animated.Image {...imageProps} />;
}
