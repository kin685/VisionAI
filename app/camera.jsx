import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router"; // add this import at the top
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef < CameraView > null;
  const [photo, setPhoto] = (useState < string) | (null > null);

  // Still loading permission status
  if (!permission) {
    return <View style={styles.container} />;
  }

  // Permission denied — ask for it
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to use the camera
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

  // ...inside the component, add:
  const router = useRouter();

  // ...replace takePicture with:
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
      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <Text style={styles.captureButtonText}>Capture</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  captureButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#2E5BBA",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
  },
  captureButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: { textAlign: "center", marginBottom: 16, fontSize: 16 },
  permissionButton: {
    backgroundColor: "#2E5BBA",
    padding: 12,
    borderRadius: 8,
  },
  permissionButtonText: { color: "#fff", fontWeight: "bold" },
});
