import { Image, StyleSheet, Text, View } from "react-native";
import { Bell, BriefcaseBusiness, Sparkles, WandSparkles } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { AppTheme } from "@/constants/theme";
import { aiSuggestions, jobMatches, metrics } from "@/constants/mockData";

export function DashboardScreen() {
  return (
    <Screen>
      <View style={styles.topbar}>
        <View>
          <Text style={styles.eyebrow}>Good morning</Text>
          <Text style={styles.heading}>Build your career command center</Text>
        </View>
        <View style={styles.iconButton}>
          <Bell size={20} color={AppTheme.colors.text} />
        </View>
      </View>

      <GlassCard style={styles.hero}>
        <View style={styles.heroCopy}>
          <View style={styles.badge}>
            <Sparkles size={14} color={AppTheme.colors.amber} />
            <Text style={styles.badgeText}>AI Career Assistant</Text>
          </View>
          <Text style={styles.heroTitle}>Ready to improve your profile today?</Text>
          <Text style={styles.heroBody}>
            Your resume has strong frontend depth. Add deployment evidence and one measurable project result to lift match scores.
          </Text>
          <GradientButton label="Run AI review" />
        </View>
        <View style={styles.heroOrb}>
          <WandSparkles size={42} color={AppTheme.colors.text} />
        </View>
      </GlassCard>

      <SectionHeader title="Career metrics" action="This week" />
      <View style={styles.metricsGrid}>
        {metrics.map((metric) => (
          <StatCard key={metric.id} metric={metric} />
        ))}
      </View>

      <SectionHeader title="Recommended roles" action="View all" />
      <View style={styles.stack}>
        {jobMatches.slice(0, 2).map((job) => (
          <GlassCard key={job.id}>
            <View style={styles.jobRow}>
              <View style={styles.companyLogo}>
                <BriefcaseBusiness size={19} color={AppTheme.colors.text} />
              </View>
              <View style={styles.jobContent}>
                <Text style={styles.cardTitle}>{job.title}</Text>
                <Text style={styles.muted}>{job.company} • {job.location} • {job.salaryRange}</Text>
              </View>
              <Text style={styles.match}>{job.matchScore}%</Text>
            </View>
          </GlassCard>
        ))}
      </View>

      <SectionHeader title="AI suggestions" />
      <View style={styles.stack}>
        {aiSuggestions.map((suggestion) => (
          <GlassCard key={suggestion.id}>
            <Text style={styles.cardTitle}>{suggestion.title}</Text>
            <Text style={styles.cardBody}>{suggestion.body}</Text>
          </GlassCard>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 18
  },
  eyebrow: {
    color: AppTheme.colors.textMuted,
    fontSize: 14,
    fontWeight: "700"
  },
  heading: {
    color: AppTheme.colors.text,
    fontSize: 28,
    lineHeight: 34,
    maxWidth: 280,
    marginTop: 4,
    fontWeight: "900"
  },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface
  },
  hero: {
    marginTop: 4
  },
  heroCopy: {
    gap: 14
  },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(248,184,78,0.13)"
  },
  badgeText: {
    color: AppTheme.colors.textSoft,
    fontSize: 12,
    fontWeight: "800"
  },
  heroTitle: {
    color: AppTheme.colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900"
  },
  heroBody: {
    color: AppTheme.colors.textSoft,
    fontSize: 14,
    lineHeight: 21
  },
  heroOrb: {
    position: "absolute",
    right: 22,
    top: 22,
    width: 86,
    height: 86,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(139,92,246,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)"
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14
  },
  stack: {
    gap: 12
  },
  jobRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  companyLogo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(139,92,246,0.2)"
  },
  jobContent: {
    flex: 1
  },
  cardTitle: {
    color: AppTheme.colors.text,
    fontSize: 15,
    fontWeight: "900"
  },
  cardBody: {
    color: AppTheme.colors.textSoft,
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20
  },
  muted: {
    color: AppTheme.colors.textMuted,
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600"
  },
  match: {
    color: AppTheme.colors.emerald,
    fontSize: 15,
    fontWeight: "900"
  }
});
