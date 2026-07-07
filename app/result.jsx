import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { analyzeImage, PROMPTS } from "../lib/gemini";
import { PERSONA_META, PersonaKey } from "../lib/personas";
import { COLORS } from "../lib/theme";

type Analysis = {
  objects: string[];
  context: string;
  activities: string;
  recommendations: string;
};

export default function ResultScreen() {
  const { base64Image, promptKey } = useLocalSearchParams<{
    base64Image: string;
    promptKey: string;
  }>();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const persona =
    PERSONA_META[(promptKey as PersonaKey) ?? "academic"] ??
    PERSONA_META.academic;

  useEffect(() => {
    runAnalysis();
  }, []);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const prompt =
        PROMPTS[promptKey as keyof typeof PROMPTS] ?? PROMPTS.academic;
      const result = await analyzeImage(base64Image, prompt);
      const textPart = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textPart) throw new Error("Empty response from Gemini");

      const cleaned = textPart.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setAnalysis(parsed);
    } catch (err) {
      console.log("Analysis error:", err);
      setError("Could not analyze this image. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={persona.color} />
        <Text style={styles.loadingText}>Analyzing image...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons
          name="alert-circle-outline"
          size={40}
          color={COLORS.shutter}
        />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const sections = [
    {
      key: "context",
      label: "Context",
      icon: "image-outline",
      body: analysis!.context,
    },
    {
      key: "activities",
      label: "Activities",
      icon: "walk-outline",
      body: analysis!.activities,
    },
    {
      key: "recommendations",
      label: "Recommendations",
      icon: "bulb-outline",
      body: analysis!.recommendations,
    },
  ] as const;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Ionicons name={persona.icon} size={18} color={persona.color} />
        <Text style={[styles.headerLabel, { color: persona.color }]}>
          {persona.label.toUpperCase()} ANALYSIS
        </Text>
      </View>

      {/* Objects as tags */}
      <View style={[styles.card, { borderLeftColor: persona.color }]}>
        <View style={styles.cardHeaderRow}>
          <Ionicons name="cube-outline" size={16} color={persona.color} />
          <Text style={[styles.cardEyebrow, { color: persona.color }]}>
            OBJECTS
          </Text>
        </View>
        <View style={styles.tagRow}>
          {analysis!.objects.map((obj, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{obj}</Text>
            </View>
          ))}
        </View>
      </View>

      {sections.map((s) => (
        <View
          key={s.key}
          style={[styles.card, { borderLeftColor: persona.color }]}
        >
          <View style={styles.cardHeaderRow}>
            <Ionicons name={s.icon} size={16} color={persona.color} />
            <Text style={[styles.cardEyebrow, { color: persona.color }]}>
              {s.label.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.cardBody}>{s.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 60 },
  centered: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: { marginTop: 14, color: COLORS.textSecondary, fontSize: 14 },
  errorText: {
    color: COLORS.textPrimary,
    textAlign: "center",
    fontSize: 15,
    marginTop: 12,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginLeft: 8,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderLeftWidth: 3,
    padding: 16,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardEyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginLeft: 6,
  },
  cardBody: { color: COLORS.textPrimary, fontSize: 14, lineHeight: 21 },
  tagRow: { flexDirection: "row", flexWrap: "wrap" },
  tag: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { color: COLORS.textPrimary, fontSize: 13 },
});
