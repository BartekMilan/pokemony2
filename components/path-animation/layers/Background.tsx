// User-provided topographic map screenshot (609×1024 source; resized for mobile asset)
import { Group, Image, Rect, useImage } from '@shopify/react-native-skia';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../data/pathDefinition';

const MAP_BACKGROUND = require('../../../assets/path-animation/map-background.png');

export function Background() {
  const image = useImage(MAP_BACKGROUND);

  return (
    <Group>
      <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} color="#00605e" />
      {image ? (
        <Image
          image={image}
          x={0}
          y={0}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          fit="cover"
        />
      ) : null}
    </Group>
  );
}
