import { StyleSheet, View } from "react-native";

export default function ViewfinderFrame({
  color = "#4FD1C5",
  inset = 24,
}: {
  color?: string;
  inset?: number;
}) {
  return (
    <View pointerEvents="none" style={[styles.wrapper, { margin: inset }]}>
      <View style={[styles.corner, styles.topLeft, { borderColor: color }]} />
      <View style={[styles.corner, styles.topRight, { borderColor: color }]} />
      <View
        style={[styles.corner, styles.bottomLeft, { borderColor: color }]}
      />
      <View
        style={[styles.corner, styles.bottomRight, { borderColor: color }]}
      />
    </View>
  );
}

const SIZE = 28;
const THICK = 3;

const styles = StyleSheet.create({
  wrapper: { ...StyleSheet.absoluteFillObject },
  corner: { position: "absolute", width: SIZE, height: SIZE },
  topLeft: { top: 0, left: 0, borderTopWidth: THICK, borderLeftWidth: THICK },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: THICK,
    borderRightWidth: THICK,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: THICK,
    borderLeftWidth: THICK,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: THICK,
    borderRightWidth: THICK,
  },
});
