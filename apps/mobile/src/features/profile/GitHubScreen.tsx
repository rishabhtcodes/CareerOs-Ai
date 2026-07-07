import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FolderGit2, GitBranch, GitCommitHorizontal, Github, Star, Trash2 } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "@/components/layout/Screen";
import { GlassCard } from "@/components/ui/GlassCard";
import { AppTheme } from "@/constants/theme";
import { useConnectGitHub, useDisconnectGitHub, useGitHub } from "@/hooks/useGitHub";

export function GitHubScreen() {
  const { data: profile, isLoading } = useGitHub();
  const { mutate: connect, isPending: connecting } = useConnectGitHub();
  const { mutate: disconnect, isPending: disconnecting } = useDisconnectGitHub();

  const [username, setUsername] = useState("");

  function handleConnect() {
    if (!username.trim()) return;
    connect(username.trim());
  }

  function handleDisconnect() {
    Alert.alert("Disconnect GitHub", "Are you sure you want to unlink your GitHub account?", [
      { text: "Cancel", style: "cancel" },
      { text: "Disconnect", style: "destructive", onPress: () => disconnect() },
    ]);
  }

  if (isLoading) {
    return (
      <Screen>
        <ActivityIndicator color={AppTheme.colors.violet} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>GitHub Profile</Text>
        <Text style={styles.subtitle}>
          Connect your GitHub account to supercharge your resume and AI suggestions.
        </Text>
      </View>

      {!profile ? (
        <GlassCard style={styles.connectCard}>
          <View style={styles.iconWrap}>
            <Github size={32} color={AppTheme.colors.text} />
          </View>
          <Text style={styles.connectTitle}>Connect your account</Text>
          <Text style={styles.connectSub}>Enter your GitHub username to fetch stats.</Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Username e.g. rishabhtcodes"
              placeholderTextColor={AppTheme.colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <Pressable
            onPress={handleConnect}
            disabled={connecting || !username.trim()}
            style={({ pressed }) => [styles.ctaOuter, pressed && { opacity: 0.82 }]}
          >
            <LinearGradient
              colors={[AppTheme.colors.violet, AppTheme.colors.magenta]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cta}
            >
              {connecting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.ctaText}>Connect GitHub</Text>
              )}
            </LinearGradient>
          </Pressable>
        </GlassCard>
      ) : (
        <View style={styles.profileWrap}>
          {/* Header Card */}
          <GlassCard style={styles.profileHeader}>
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileUsername}>@{profile.username}</Text>
              <Text style={styles.syncedAt}>
                Synced {new Date(profile.syncedAt).toLocaleDateString()}
              </Text>
            </View>
            <Pressable onPress={handleDisconnect} disabled={disconnecting} style={styles.unlinkBtn}>
              <Trash2 size={16} color={AppTheme.colors.rose} />
            </Pressable>
          </GlassCard>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <GlassCard style={styles.statCard}>
              <FolderGit2 size={20} color={AppTheme.colors.cyan} />
              <Text style={styles.statValue}>{profile.repoCount}</Text>
              <Text style={styles.statLabel}>Repositories</Text>
            </GlassCard>
            <GlassCard style={styles.statCard}>
              <Star size={20} color={AppTheme.colors.amber} />
              <Text style={styles.statValue}>{profile.totalStars}</Text>
              <Text style={styles.statLabel}>Total Stars</Text>
            </GlassCard>
            <GlassCard style={styles.statCard}>
              <GitCommitHorizontal size={20} color={AppTheme.colors.emerald} />
              <Text style={styles.statValue}>{profile.totalCommits}</Text>
              <Text style={styles.statLabel}>Commits (Year)</Text>
            </GlassCard>
          </View>

          {/* Languages */}
          <Text style={styles.sectionTitle}>Top Languages</Text>
          <GlassCard style={styles.langCard}>
            {profile.topLanguages.map((lang, index) => (
              <View key={lang.name} style={styles.langRow}>
                <View style={[styles.langDot, { backgroundColor: lang.color }]} />
                <Text style={styles.langName}>{lang.name}</Text>
                <Text style={styles.langPct}>{lang.percentage}%</Text>
                {/* Progress bar */}
                <View style={styles.langTrack}>
                  <View style={[styles.langFill, { backgroundColor: lang.color, width: `${lang.percentage}%` }]} />
                </View>
              </View>
            ))}
          </GlassCard>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20, marginTop: 10 },
  title: { color: AppTheme.colors.text, fontSize: 30, fontWeight: "900" },
  subtitle: { color: AppTheme.colors.textSoft, fontSize: 14, lineHeight: 21, marginTop: 8 },
  connectCard: { alignItems: "center", paddingVertical: 32 },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  connectTitle: { color: AppTheme.colors.text, fontSize: 20, fontWeight: "900" },
  connectSub: { color: AppTheme.colors.textMuted, fontSize: 13, marginTop: 6, marginBottom: 24 },
  inputRow: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    marginBottom: 12,
  },
  input: { flex: 1, color: AppTheme.colors.text, fontSize: 15, height: "100%" },
  ctaOuter: { width: "100%", borderRadius: 16, overflow: "hidden" },
  cta: { height: 52, alignItems: "center", justifyContent: "center" },
  ctaText: { color: "#fff", fontSize: 15, fontWeight: "800" },

  profileWrap: { gap: 16 },
  profileHeader: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  profileInfo: { flex: 1, justifyContent: "center" },
  profileUsername: { color: AppTheme.colors.text, fontSize: 18, fontWeight: "900" },
  syncedAt: { color: AppTheme.colors.textMuted, fontSize: 12, marginTop: 4 },
  unlinkBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(251,113,133,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsGrid: { flexDirection: "row", gap: 12 },
  statCard: { flex: 1, alignItems: "center", padding: 16, gap: 8 },
  statValue: { color: AppTheme.colors.text, fontSize: 22, fontWeight: "900" },
  statLabel: { color: AppTheme.colors.textMuted, fontSize: 11, fontWeight: "700", textAlign: "center" },
  sectionTitle: { color: AppTheme.colors.text, fontSize: 16, fontWeight: "800", marginTop: 8 },
  langCard: { gap: 16, padding: 18 },
  langRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  langDot: { width: 10, height: 10, borderRadius: 5 },
  langName: { flex: 1, color: AppTheme.colors.text, fontSize: 14, fontWeight: "600" },
  langPct: { color: AppTheme.colors.textMuted, fontSize: 13, fontWeight: "700", width: 40, textAlign: "right" },
  langTrack: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  langFill: { height: "100%", borderRadius: 3 },
});
