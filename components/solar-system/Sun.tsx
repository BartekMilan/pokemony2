import { StyleSheet, View } from 'react-native';

const DEFAULT_SIZE = 56;

type SunProps = {
  size?: number;
};

export function Sun({ size = DEFAULT_SIZE }: SunProps) {
  const half = size / 2;

  return (
    <View
      style={[
        styles.sun,
        {
          width: size,
          height: size,
          borderRadius: half,
          marginLeft: -half,
          marginTop: -half,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  sun: {
    backgroundColor: '#FDB813',
  },
});
