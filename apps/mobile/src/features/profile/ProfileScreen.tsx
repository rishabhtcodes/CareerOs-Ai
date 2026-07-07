import { StyleSheet, Text, View } from "react-native";
import { Award, ChevronRight, Github, Settings, ShieldCheck, UserRound } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppTheme } from "@/constants/theme";

const rows = [
  { label: "Personal details", icon: UserRound },
  { label: "GitHub connected", icon: Github },
  { label: "Achievements", icon: Award },
  { label: "AI preferences", icon: Settings },
  { label: "Privacy and security", icon: ShieldCheck }
];

export function ProfileScreen() {
  return (
    <Screen>
      <GlassCard style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>RT</Text>
        </View>
        <Text style={styles.name}>Rishabh Tiwari</Text>
        <Text style={styles.role}>Full Stack Developer • Pro Member</Text>
        <View style={styles.levelTrack}>
          <View style={styles.levelFill} />
        </View>
        <View style={styles.stats}>
          <View>
            <Text style={styles.statValue}>36</Text>
            <Text style={styles.statLabel}>Applications</Text>
          </View>
          <View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Interviews</Text>
          </View>
          <View>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Offers</Text>
          </View>
        </View>
      </GlassCard>

      <SectionHeader title="Career profile" />
      <View style={styles.stack}>
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <GlassCard key={row.label}>
              <View style={styles.row}>
                <View style={styles.rowIcon}>
                  <Icon size={18} color={AppTheme.colors.text} />
                </View>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <ChevronRight size={18} color={AppTheme.colors.textMuted} />
              </View>
            </GlassCard>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: "center",
    marginTop: 12
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppTheme.colors.amber,
    marginBottom: 14
  },
  avatarText: {
    color: "#141018",
    fontSize: 25,
    fontWeight: "900"
  },
  name: {
    color: AppTheme.colors.text,
    fontSize: 24,
    fontWeight: "900"
  },
  role: {
    color: AppTheme.colors.textMuted,
    marginTop: 7,
    fontSize: 13,
    fontWeight: "700"
  },
  levelTrack: {
    height: 8,
    width: "100%",
    borderRadius: 99,
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden"
  },
  levelFill: {
    width: "68%",
    height: "100%",
    backgroundColor: AppTheme.colors.amber
  },
  stats: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 22
  },
  statValue: {
    color: AppTheme.colors.text,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "900"
  },
  statLabel: {
    color: AppTheme.colors.textMuted,
    marginTop: 4,
    fontSize: 11,
    fontWeight: "700"
  },
  stack: {
    gap: 12
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  rowLabel: {
    flex: 1,
    color: AppTheme.colors.text,
    fontSize: 14,
    fontWeight: "800"
  }
});
