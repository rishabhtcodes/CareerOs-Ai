import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Award,
  BookOpen,
  Briefcase,
  ChevronRight,
  Github,
  Globe,
  LogOut,
  Settings,
  ShieldCheck,
  User,
  Wrench,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { AppTheme } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";

const SECTIONS = [
  { label: "Personal details", icon: User, href: "/profile/edit" },
  { label: "Experience", icon: Briefcase, href: "/profile/experience" },
  { label: "Education", icon: BookOpen, href: "/profile/education" },
  { label: "Skills", icon: Wrench, href: "/profile/skills" },
  { label: "Projects", icon: Globe, href: "/profile/projects" },
  { label: "Achievements", icon: Award, href: "/profile/achievements" },
  { label: "GitHub connected", icon: Github, href: "/profile/github" },
  { label: "AI preferences", icon: Settings, href: "/profile/ai-settings" },
  { label: "Privacy and security", icon: ShieldCheck, href: "/profile/security" },
] as const;

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const { data: profile, isLoading, refetch } = useProfile();
  const router = useRouter();

  const initials = (user?.name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const skillCount = profile?.skills?.length ?? 0;
  const expCount = profile?.experience?.length ?? 0;
  const projCount = profile?.projects?.length ?? 0;
  const eduCount = profile?.education?.length ?? 0;

  // Profile strength: based on filled sections
  const filled = [
    !!profile?.headline,
    !!profile?.bio,
    !!profile?.location,
    skillCount > 0,
    expCount > 0,
    projCount > 0,
    eduCount > 0,
    (profile?.socialLinks?.length ?? 0) > 0,
  ].filter(Boolean).length;
  const strength = Math.round((filled / 8) * 100);

  function handleLogout() {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: logout },
    ]);
  }

  return (
    <Screen onRefresh={refetch}>
      {/* Profile Card */}
      <GlassCard style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        {isLoading ? (
          <>
            <Skeleton width={160} height={22} borderRadius={8} />
            <Skeleton width={220} height={16} borderRadius={8} style={{ marginTop: 8 }} />
          </>
        ) : (
          <>
            <Text style={styles.name}>{user?.name ?? "Your Name"}</Text>
            <Text style={styles.role}>
              {profile?.headline ?? profile?.targetRole ?? "Add your headline"}
            </Text>
            {profile?.location ? (
              <Text style={styles.location}>{profile.location}</Text>
            ) : null}
          </>
        )}

        {/* Profile Strength Bar */}
        <View style={styles.strengthWrap}>
          <View style={styles.strengthLabelRow}>
            <Text style={styles.strengthLabel}>Profile strength</Text>
            <Text style={[styles.strengthPct, { color: strength > 60 ? AppTheme.colors.emerald : AppTheme.colors.amber }]}>
              {isLoading ? "—" : `${strength}%`}
            </Text>
          </View>
          <View style={styles.strengthTrack}>
            <View
              style={[
                styles.strengthFill,
                {
                  width: `${isLoading ? 0 : strength}%`,
                  backgroundColor:
                    strength > 60 ? AppTheme.colors.emerald : AppTheme.colors.amber,
                },
              ]}
            />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View>
            <Text style={styles.statValue}>{isLoading ? "—" : expCount}</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
          <View>
            <Text style={styles.statValue}>{isLoading ? "—" : projCount}</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
          <View>
            <Text style={styles.statValue}>{isLoading ? "—" : skillCount}</Text>
            <Text style={styles.statLabel}>Skills</Text>
          </View>
        </View>
      </GlassCard>

      <SectionHeader title="Career profile" />
      <View style={styles.stack}>
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <TouchableOpacity
              key={section.label}
              onPress={() => router.push(section.href as any)}
              activeOpacity={0.75}
            >
              <GlassCard>
                <View style={styles.row}>
                  <View style={styles.rowIcon}>
                    <Icon size={18} color={AppTheme.colors.text} />
                  </View>
                  <Text style={styles.rowLabel}>{section.label}</Text>
                  <ChevronRight size={18} color={AppTheme.colors.textMuted} />
                </View>
              </GlassCard>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Logout */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} activeOpacity={0.75}>
        <LogOut size={18} color={AppTheme.colors.rose} />
        <Text style={styles.logoutText}>Sign out</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: { alignItems: "center", marginTop: 12, gap: 10 },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppTheme.colors.violet,
    marginBottom: 6,
  },
  avatarText: { color: "#fff", fontSize: 25, fontWeight: "900" },
  name: { color: AppTheme.colors.text, fontSize: 22, fontWeight: "900", textAlign: "center" },
  role: { color: AppTheme.colors.textMuted, fontSize: 13, fontWeight: "700", textAlign: "center" },
  location: { color: AppTheme.colors.textMuted, fontSize: 12, textAlign: "center" },
  strengthWrap: { width: "100%", gap: 8, marginTop: 8 },
  strengthLabelRow: { flexDirection: "row", justifyContent: "space-between" },
  strengthLabel: { color: AppTheme.colors.textMuted, fontSize: 12, fontWeight: "700" },
  strengthPct: { fontSize: 12, fontWeight: "900" },
  strengthTrack: {
    height: 8,
    width: "100%",
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  strengthFill: { height: "100%", borderRadius: 99 },
  stats: { width: "100%", flexDirection: "row", justifyContent: "space-around", marginTop: 12 },
  statValue: { color: AppTheme.colors.text, textAlign: "center", fontSize: 22, fontWeight: "900" },
  statLabel: { color: AppTheme.colors.textMuted, marginTop: 4, fontSize: 11, fontWeight: "700", textAlign: "center" },
  stack: { gap: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  rowLabel: { flex: 1, color: AppTheme.colors.text, fontSize: 14, fontWeight: "800" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 24,
    marginBottom: 8,
    height: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(251,113,133,0.3)",
    backgroundColor: "rgba(251,113,133,0.06)",
  },
  logoutText: { color: AppTheme.colors.rose, fontSize: 15, fontWeight: "800" },
});
