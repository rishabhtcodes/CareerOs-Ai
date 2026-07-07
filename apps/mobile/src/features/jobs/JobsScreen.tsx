import { StyleSheet, Text, TextInput, View } from "react-native";
import { Filter, Search } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppTheme } from "@/constants/theme";
import { jobMatches } from "@/constants/mockData";

export function JobsScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Explore jobs</Text>
      <Text style={styles.subtitle}>AI-ranked opportunities based on your master career profile.</Text>

      <View style={styles.searchBar}>
        <Search size={18} color={AppTheme.colors.textMuted} />
        <TextInput
          placeholder="Search roles, companies, skills"
          placeholderTextColor={AppTheme.colors.textMuted}
          style={styles.input}
        />
        <View style={styles.filter}>
          <Filter size={16} color={AppTheme.colors.text} />
        </View>
      </View>

      <SectionHeader title="Best matches" action="3 roles" />
      <View style={styles.stack}>
        {jobMatches.map((job) => (
          <GlassCard key={job.id}>
            <View style={styles.row}>
              <View style={styles.score}>
                <Text style={styles.scoreText}>{job.matchScore}</Text>
                <Text style={styles.scoreLabel}>match</Text>
              </View>
              <View style={styles.body}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.meta}>{job.company} • {job.location}</Text>
                <View style={styles.pillRow}>
                  <Text style={styles.pill}>{job.role}</Text>
                  <Text style={styles.pill}>{job.status}</Text>
                  <Text style={styles.salary}>{job.salaryRange}</Text>
                </View>
              </View>
            </View>
          </GlassCard>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: AppTheme.colors.text,
    fontSize: 30,
    fontWeight: "900",
    marginTop: 10
  },
  subtitle: {
    color: AppTheme.colors.textSoft,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 20
  },
  searchBar: {
    height: 56,
    borderRadius: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: AppTheme.colors.surface,
    borderWidth: 1,
    borderColor: AppTheme.colors.border
  },
  input: {
    flex: 1,
    color: AppTheme.colors.text,
    fontSize: 14
  },
  filter: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  stack: {
    gap: 12
  },
  row: {
    flexDirection: "row",
    gap: 14
  },
  score: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(52,211,153,0.14)"
  },
  scoreText: {
    color: AppTheme.colors.emerald,
    fontSize: 18,
    fontWeight: "900"
  },
  scoreLabel: {
    color: AppTheme.colors.textMuted,
    fontSize: 10,
    fontWeight: "700"
  },
  body: {
    flex: 1
  },
  jobTitle: {
    color: AppTheme.colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  meta: {
    color: AppTheme.colors.textMuted,
    marginTop: 5,
    fontSize: 13,
    fontWeight: "600"
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  pill: {
    color: AppTheme.colors.textSoft,
    overflow: "hidden",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.07)",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "capitalize"
  },
  salary: {
    color: AppTheme.colors.amber,
    fontSize: 12,
    fontWeight: "900",
    paddingVertical: 6
  }
});
