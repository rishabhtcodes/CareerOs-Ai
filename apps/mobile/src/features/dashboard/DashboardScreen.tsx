import { StyleSheet, Text, View } from "react-native";
import { Bell, BriefcaseBusiness, Sparkles, WandSparkles } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { AppTheme } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import type { CareerMetric } from "@careeros/shared";

export function DashboardScreen() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useDashboardSummary();

  const firstName = user?.name?.split(" ")[0] ?? "there";

  const metrics: CareerMetric[] = data
    ? [
        { id: "profile", label: "Profile", value: `${data.profileStrength}%`, delta: "", tone: "violet" },
        { id: "skills", label: "Skills", value: String(data.skills), delta: "", tone: "cyan" },
        { id: "projects", label: "Projects", value: String(data.projects), delta: "", tone: "emerald" },
        { id: "apps", label: "Applications", value: String(data.applications), delta: "", tone: "amber" },
      ]
    : [];

  return (
    <Screen onRefresh={refetch}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <View>
          <Text style={styles.eyebrow}>Good morning, {firstName}</Text>
          <Text style={styles.heading}>Your career command center</Text>
        </View>
        <View style={styles.iconButton}>
          <Bell size={20} color={AppTheme.colors.text} />
        </View>
      </View>

      {/* Hero AI Card */}
      <GlassCard style={styles.hero}>
        <View style={styles.heroCopy}>
          <View style={styles.badge}>
            <Sparkles size={14} color={AppTheme.colors.amber} />
            <Text style={styles.badgeText}>AI Career Assistant</Text>
          </View>
          {isLoading ? (
            <>
              <Skeleton height={22} width="85%" borderRadius={8} />
              <Skeleton height={16} width="100%" borderRadius={8} />
              <Skeleton height={16} width="70%" borderRadius={8} />
            </>
          ) : (
            <>
              <Text style={styles.heroTitle}>Ready to improve your profile today?</Text>
              <Text style={styles.heroBody}>
                {data?.aiSuggestions?.[0] ?? "Your profile looks great — keep building!"}
              </Text>
              <GradientButton label="Run AI review" />
            </>
          )}
        </View>
        <View style={styles.heroOrb}>
          <WandSparkles size={42} color={AppTheme.colors.text} />
        </View>
      </GlassCard>

      {/* Metrics */}
      <SectionHeader title="Career metrics" action="This week" />
      {isLoading ? (
        <View style={styles.metricsGrid}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} width="47%" height={90} borderRadius={18} />
          ))}
        </View>
      ) : (
        <View style={styles.metricsGrid}>
          {metrics.map((metric) => (
            <StatCard key={metric.id} metric={metric} />
          ))}
        </View>
      )}

      {/* Recent Resumes */}
      <SectionHeader title="Recent resumes" action="View all" />
      <View style={styles.stack}>
        {isLoading ? (
          <>
            <Skeleton height={72} borderRadius={18} />
            <Skeleton height={72} borderRadius={18} />
          </>
        ) : isError ? (
          <Text style={styles.errorText}>Could not load data. Pull to refresh.</Text>
        ) : (
          (data?.recentResumes ?? []).slice(0, 3).map((resume) => (
            <GlassCard key={resume.id}>
              <View style={styles.jobRow}>
                <View style={styles.companyLogo}>
                  <BriefcaseBusiness size={19} color={AppTheme.colors.text} />
                </View>
                <View style={styles.jobContent}>
                  <Text style={styles.cardTitle}>{resume.title}</Text>
                  <Text style={styles.muted}>ATS Score: {resume.atsScore}</Text>
                </View>
                <Text style={styles.match}>{resume.atsScore}</Text>
              </View>
            </GlassCard>
          ))
        )}
      </View>

      {/* AI Suggestions */}
      <SectionHeader title="AI suggestions" />
      <View style={styles.stack}>
        {isLoading ? (
          <>
            <Skeleton height={72} borderRadius={18} />
            <Skeleton height={72} borderRadius={18} />
          </>
        ) : (
          (data?.aiSuggestions ?? []).map((suggestion, i) => (
            <GlassCard key={i}>
              <Text style={styles.cardTitle}>Tip {i + 1}</Text>
              <Text style={styles.cardBody}>{suggestion}</Text>
            </GlassCard>
          ))
        )}
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
    marginBottom: 18,
  },
  eyebrow: { color: AppTheme.colors.textMuted, fontSize: 14, fontWeight: "700" },
  heading: {
    color: AppTheme.colors.text,
    fontSize: 24,
    lineHeight: 30,
    maxWidth: 260,
    marginTop: 4,
    fontWeight: "900",
  },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface,
  },
  hero: { marginTop: 4 },
  heroCopy: { gap: 14 },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(248,184,78,0.13)",
  },
  badgeText: { color: AppTheme.colors.textSoft, fontSize: 12, fontWeight: "800" },
  heroTitle: { color: AppTheme.colors.text, fontSize: 22, lineHeight: 28, fontWeight: "900" },
  heroBody: { color: AppTheme.colors.textSoft, fontSize: 14, lineHeight: 21 },
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
    borderColor: "rgba(255,255,255,0.12)",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },
  stack: { gap: 12 },
  jobRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  companyLogo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(139,92,246,0.2)",
  },
  jobContent: { flex: 1 },
  cardTitle: { color: AppTheme.colors.text, fontSize: 15, fontWeight: "900" },
  cardBody: { color: AppTheme.colors.textSoft, marginTop: 8, fontSize: 13, lineHeight: 20 },
  muted: { color: AppTheme.colors.textMuted, marginTop: 5, fontSize: 12, fontWeight: "600" },
  match: { color: AppTheme.colors.emerald, fontSize: 15, fontWeight: "900" },
  errorText: { color: AppTheme.colors.rose, fontSize: 13, textAlign: "center", padding: 16 },
});
