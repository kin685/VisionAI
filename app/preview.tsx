import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewfinderFrame from "../components/ViewfinderFrame";
import { imageToBase64 } from "../lib/gemini";
import { PERSONA_META, PersonaKey } from "../lib/personas";
import { COLORS } from "../lib/theme";

export default function PreviewScreen() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isTablet = Math.min(width, height) >= 768;

  async function goAnalyze(promptKey: PersonaKey) {
    const base64Image = await imageToBase64(photoUri);
    router.push({ pathname: "/result", params: { base64Image, promptKey } });
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: photoUri }}
          resizeMode="contain"
          style={[
            styles.preview,
            isTablet && { maxWidth: 600, alignSelf: "center" },
          ]}
        />
        <ViewfinderFrame color={COLORS.accent} inset={16} />
      </View>

      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 12 }]}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        <Text style={styles.backLabel}>Retake</Text>
      </TouchableOpacity>

      <View style={[styles.panel, { paddingBottom: insets.bottom + 20 }]}>
        <Text style={styles.eyebrow}>CHOOSE AN ANALYSIS</Text>
        <View style={styles.personaRow}>
          {(Object.keys(PERSONA_META) as PersonaKey[]).map((key) => {
            const persona = PERSONA_META[key];
            return (
              <TouchableOpacity
                key={key}
                style={[styles.personaChip, { borderColor: persona.color }]}
                onPress={() => goAnalyze(key)}
              >
                <Ionicons name={persona.icon} size={20} color={persona.color} />
                <Text style={[styles.personaLabel, { color: persona.color }]}>
                  {persona.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  imageWrapper: { flex: 1, width: "100%" },
  preview: { flex: 1, width: "100%", height: "100%" },
  backButton: {
    position: "absolute",
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(14,17,22,0.55)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  backLabel: {
    color: COLORS.textPrimary,
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 13,
  },
  panel: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  eyebrow: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 14,
  },
  personaRow: { flexDirection: "row", justifyContent: "space-between" },
  personaChip: {
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: COLORS.surfaceAlt,
  },
  personaLabel: { marginTop: 6, fontSize: 12, fontWeight: "700" },
});
