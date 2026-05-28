import * as Haptics from 'expo-haptics';

export function triggerWallHaptic() {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function triggerGoalHaptic() {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
