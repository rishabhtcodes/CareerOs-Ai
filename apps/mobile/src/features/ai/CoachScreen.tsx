import { StyleSheet, Text, TextInput, View } from "react-native";
import { Bot, Send, Sparkles } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppTheme } from "@/constants/theme";

const prompts = [
  "How do I become a full stack developer?",
  "What projects should I build next?",
  "Improve my resume for AI roles"
];

export function CoachScreen() {
  return (
    <Screen>
      <View style={styles.heroIcon}>
        <Bot size={38} color={AppTheme.colors.text} />
      </View>
      <Text style={styles.title}>CareerOS AI</Text>
      <Text style={styles.subtitle}>Your profile-aware coach for resumes, roadmaps, projects, and job search strategy.</Text>

      <GlassCard style={styles.messageCard}>
        <View style={styles.row}>
          <Sparkles size={18} color={AppTheme.colors.amber} />
          <Text style={styles.cardTitle}>Hi Rishabh. Here is today’s career focus.</Text>
        </View>
        <Text style={styles.body}>
          Prioritize one full stack case study, refresh the top third of your resume, and apply to roles above 85% match.
        </Text>
      </GlassCard>

      <SectionHeader title="Suggested prompts" />
      <View style={styles.stack}>
        {prompts.map((prompt) => (
          <GlassCard key={prompt}>
            <Text style={styles.prompt}>{prompt}</Text>
          </GlassCard>
        ))}
      </View>

      <View style={styles.composer}>
        <TextInput
          placeholder="Ask anything about your career"
          placeholderTextColor={AppTheme.colors.textMuted}
          style={styles.input}
          multiline
        />
        <View style={styles.send}>
          <Send size={17} color={AppTheme.colors.text} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroIcon: {
    width: 84,
    height: 84,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    backgroundColor: "rgba(139,92,246,0.25)",
    borderWidth: 1,
    borderColor: AppTheme.colors.border
  },
  title: {
    color: AppTheme.colors.text,
    fontSize: 32,
    fontWeight: "900",
    marginTop: 20
  },
  subtitle: {
    color: AppTheme.colors.textSoft,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 20
  },
  messageCard: {
    marginTop: 4
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9
  },
  cardTitle: {
    flex: 1,
    color: AppTheme.colors.text,
    fontSize: 15,
    fontWeight: "900"
  },
  body: {
    color: AppTheme.colors.textSoft,
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21
  },
  stack: {
    gap: 12
  },
  prompt: {
    color: AppTheme.colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  composer: {
    minHeight: 64,
    borderRadius: 22,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface
  },
  input: {
    flex: 1,
    color: AppTheme.colors.text,
    fontSize: 14,
    maxHeight: 100
  },
  send: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppTheme.colors.violet
  }
});
