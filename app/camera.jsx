import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewfinderFrame from "../../components/ViewfinderFrame";
import { COLORS } from "../../lib/theme";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef < CameraView > null;
  const insets = useSafeAreaInsets();
  const router = useRouter();

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="aperture-outline" size={48} color={COLORS.accent} />
        <Text style={styles.permissionTitle}>Camera access needed</Text>
        <Text style={styles.permissionText}>
          {Platform.OS === "ios"
            ? 'VisionAI needs camera access. Tap below, then choose "Allow" in the dialog.'
            : "VisionAI needs camera access. Tap below to grant the permission."}
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function takePicture() {
    if (!cameraRef.current) return;
    const result = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    if (result) {
      router.push({ pathname: "/preview", params: { photoUri: result.uri } });
    }
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <ViewfinderFrame color={COLORS.accent} />

      <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.eyebrow}>VISIONAI</Text>
        <Text style={styles.hint}>Frame your subject, then capture</Text>
      </View>

      <View style={[styles.shutterRow, { bottom: insets.bottom + 28 }]}>
        <TouchableOpacity style={styles.shutterOuter} onPress={takePicture}>
          <View style={styles.shutterInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  camera: { flex: 1 },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  eyebrow: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 3,
  },
  hint: {
    color: COLORS.textPrimary,
    fontSize: 13,
    marginTop: 4,
    opacity: 0.8,
  },
  shutterRow: {
    position: "absolute",
    alignSelf: "center",
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(14,17,22,0.4)",
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.shutter,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  permissionTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
  },
  permissionText: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 20,
  },
  permissionButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  permissionButtonText: {
    color: COLORS.bg,
    fontWeight: "700",
    fontSize: 15,
  },
});
