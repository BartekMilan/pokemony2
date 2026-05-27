import type { WithSpringConfig } from 'react-native-reanimated';

/** Standard trading-card aspect ratio ~2.5:3.5. */
export const CARD_W = 280;
export const CARD_H = 390;
export const CARD_BORDER_RADIUS = 16;

/** Perspective must live on a parent — prevents flat-looking 3D. */
export const PERSPECTIVE = 1000;

/** Max shell rotation; keeps card readable and avoids backface issues. */
export const MAX_ROTATE_DEG = 12;

/** Device pitch range in radians (~±30°). */
export const SENSOR_PITCH_IN: [number, number] = [-0.5, 0.5];
export const SENSOR_ROLL_IN: [number, number] = [-0.5, 0.5];

/** Map pitch to rotateX degrees (inverted so forward tilt lifts top edge). */
export const ROTATE_X_OUT: [number, number] = [MAX_ROTATE_DEG, -MAX_ROTATE_DEG];
export const ROTATE_Y_OUT: [number, number] = [-MAX_ROTATE_DEG, MAX_ROTATE_DEG];

/** Spring smoothing — intentional lag behind sharp flicks. */
export const CARD_SPRING_CONFIG: WithSpringConfig = {
  damping: 15,
  stiffness: 150,
};

/** Parallax multipliers per layer (see ARCHITECTURE.md). */
export const BACKGROUND_PARALLAX = { x: 0.3, y: 0.3 };
export const POKEMON_PARALLAX = { x: 0.8, y: 0.8 };
export const FRAME_PARALLAX = { x: 0, y: 0 };

/** Max pixel offset at full tilt for parallax layers. */
export const PARALLAX_X_RANGE = 18;
export const PARALLAX_Y_RANGE = 18;

/** Slight scale on Pokemon layer to hide edge gaps during parallax. */
export const POKEMON_SCALE = 1.02;

/** Holo glare tuning. */
export const GLARE_OPACITY = 0.35;
export const GLARE_SWEEP_RANGE = CARD_W;

/** Dev mock pan maps screen drag to this radian range. */
export const MOCK_TILT_RANGE = 0.5;
