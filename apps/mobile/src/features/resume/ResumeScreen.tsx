import { StyleSheet, Text, View } from "react-native";
import { Download, FileCheck2, Plus } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppTheme } from "@/constants/theme";

const resumes = [
  { id: "r1", title: "Frontend Developer", score: 92, updated: "Updated 2 days ago" },
  { id: "r2", title: "Full Stack Engineer", score: 88, updated: "Updated last week" },
  { id: "r3", title: "AI Product Engineer", score: 81, updated: "Draft" }
];

export function ResumeScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My resumes</Text>
          <Text style={styles.subtitle}>Generate targeted resumes from one career profile.</Text>
        </View>
        <View style={styles.addButton}>
          <Plus size={20} color={AppTheme.colors.text} />
        </View>
      </View>

      <GlassCard style={styles.scoreCard}>
        <View style={styles.row}>
          <View style={styles.iconTile}>
            <FileCheck2 size={24} color={AppTheme.colors.text} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>ATS readiness</Text>
            <Text style={styles.muted}>Strong keywords, clear sections, measurable impact.</Text>
          </View>
          <Text style={styles.bigScore}>92</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
        <GradientButton label="Generate new resume" />
      </GlassCard>

      <SectionHeader title="Resume library" action="Export PDF" />
      <View style={styles.stack}>
        {resumes.map((resume) => (
          <GlassCard key={resume.id}>
            <View style={styles.row}>
              <View style={styles.flex}>
                <Text style={styles.cardTitle}>{resume.title}</Text>
                <Text style={styles.muted}>{resume.updated}</Text>
              </View>
              <Text style={styles.resumeScore}>{resume.score}</Text>
              <Download size={19} color={AppTheme.colors.textMuted} />
            </View>
          </GlassCard>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    marginTop: 10,
    marginBottom: 18
  },
  title: {
    color: AppTheme.colors.text,
    fontSize: 30,
    fontWeight: "900"
  },
  subtitle: {
    color: AppTheme.colors.textSoft,
    maxWidth: 260,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppTheme.colors.violet
  },
  scoreCard: {
    marginBottom: 2
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  flex: {
    flex: 1
  },
  iconTile: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(232,121,249,0.18)"
  },
  cardTitle: {
    color: AppTheme.colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  muted: {
    color: AppTheme.colors.textMuted,
    marginTop: 5,
    fontSize: 12,
    lineHeight: 17
  },
  bigScore: {
    color: AppTheme.colors.emerald,
    fontSize: 32,
    fontWeight: "900"
  },
  progressTrack: {
    height: 8,
    borderRadius: 99,
    marginVertical: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden"
  },
  progressFill: {
    width: "92%",
    height: "100%",
    borderRadius: 99,
    backgroundColor: AppTheme.colors.violet
  },
  stack: {
    gap: 12
  },
  resumeScore: {
    color: AppTheme.colors.emerald,
    fontSize: 18,
    fontWeight: "900"
  }
});
