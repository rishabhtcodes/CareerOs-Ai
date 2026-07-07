import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AlertCircle,
  Briefcase,
  CheckCircle,
  ChevronRight,
  Filter,
  Plus,
  Search,
  Sparkles,
  X,
  XCircle,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Screen } from "@/components/layout/Screen";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { AppTheme } from "@/constants/theme";
import { fetchApplications, analyzeJob, type JobAnalysisResult } from "@/services/api/jobs";

const STATUS_COLORS: Record<string, string> = {
  SAVED: AppTheme.colors.textMuted,
  APPLIED: AppTheme.colors.cyan,
  SCREENING: AppTheme.colors.amber,
  INTERVIEW: AppTheme.colors.violet,
  OFFER: AppTheme.colors.emerald,
  REJECTED: AppTheme.colors.rose,
};

export function JobsScreen() {
  const queryClient = useQueryClient();
  const { data: applications, isLoading, refetch } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplications,
  });
  const { mutate: analyze, isPending: analyzing } = useMutation({
    mutationFn: analyzeJob,
    onSuccess: (result) => {
      setAnalysisResult(result);
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [analyzerVisible, setAnalyzerVisible] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState<JobAnalysisResult | null>(null);

  function handleAnalyze() {
    if (!jobDescription.trim()) return;
    analyze({ description: jobDescription.trim() });
  }

  const filtered = (applications ?? []).filter(
    (a) =>
      a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Screen onRefresh={refetch}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>Job tracker</Text>
          <Text style={styles.subtitle}>AI-ranked opportunities and application pipeline.</Text>
        </View>
        <TouchableOpacity
          style={styles.analyzeBtn}
          onPress={() => setAnalyzerVisible(true)}
          activeOpacity={0.8}
        >
          <Sparkles size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Search size={18} color={AppTheme.colors.textMuted} />
        <TextInput
          placeholder="Search roles, companies"
          placeholderTextColor={AppTheme.colors.textMuted}
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.filterChip}>
          <Filter size={15} color={AppTheme.colors.text} />
        </View>
      </View>

      <SectionHeader title="Applications" action={`${filtered.length} total`} />
      <View style={styles.stack}>
        {isLoading ? (
          <>
            <Skeleton height={80} borderRadius={18} />
            <Skeleton height={80} borderRadius={18} />
          </>
        ) : !filtered.length ? (
          <EmptyState
            icon={Briefcase}
            title="No applications yet"
            subtitle="Tap the ✨ button to analyze a job and track it"
          />
        ) : (
          filtered.map((app) => (
            <GlassCard key={app.id}>
              <View style={styles.appRow}>
                <View style={styles.appIcon}>
                  <Briefcase size={18} color={AppTheme.colors.text} />
                </View>
                <View style={styles.appBody}>
                  <Text style={styles.appRole}>{app.role}</Text>
                  <Text style={styles.appCompany}>{app.company}</Text>
                </View>
                <View style={styles.appRight}>
                  <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[app.status] ?? AppTheme.colors.textMuted }]} />
                  <Text style={[styles.statusText, { color: STATUS_COLORS[app.status] }]}>
                    {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                  </Text>
                  {app.matchScore ? (
                    <Text style={styles.matchScore}>{app.matchScore}%</Text>
                  ) : null}
                </View>
                <ChevronRight size={16} color={AppTheme.colors.textMuted} />
              </View>
            </GlassCard>
          ))
        )}
      </View>

      {/* Job Analyzer Modal */}
      <Modal
        visible={analyzerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => { setAnalyzerVisible(false); setAnalysisResult(null); }}
      >
        <View style={styles.overlay}>
          <ScrollView style={styles.sheet} contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Job Analyzer</Text>
              <TouchableOpacity
                onPress={() => { setAnalyzerVisible(false); setAnalysisResult(null); }}
                hitSlop={12}
              >
                <X size={22} color={AppTheme.colors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.sheetSub}>
              Paste a job description. AI will match it to your profile.
            </Text>

            {!analysisResult ? (
              <>
                <TextInput
                  style={styles.descInput}
                  placeholder="Paste job description here..."
                  placeholderTextColor={AppTheme.colors.textMuted}
                  multiline
                  value={jobDescription}
                  onChangeText={setJobDescription}
                />
                <Pressable
                  onPress={handleAnalyze}
                  disabled={analyzing || !jobDescription.trim()}
                  style={({ pressed }) => [styles.analyzeAction, pressed && { opacity: 0.8 }]}
                >
                  <LinearGradient
                    colors={[AppTheme.colors.violet, AppTheme.colors.cyan]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.analyzeCta}
                  >
                    {analyzing ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.analyzeCTAText}>Analyze job</Text>
                    )}
                  </LinearGradient>
                </Pressable>
              </>
            ) : (
              /* Analysis Results */
              <View style={styles.resultWrap}>
                {/* Match Score */}
                <View style={styles.scoreCircleWrap}>
                  <View style={styles.scoreCircle}>
                    <Text style={styles.scoreCircleNum}>{analysisResult.matchScore}</Text>
                    <Text style={styles.scoreCircleLabel}>% match</Text>
                  </View>
                </View>

                {/* Skills matched */}
                <Text style={styles.resultSection}>✅ Matched skills</Text>
                <View style={styles.tagRow}>
                  {analysisResult.extractedSkills.length ? (
                    analysisResult.extractedSkills.map((skill) => (
                      <View key={skill} style={[styles.tag, { borderColor: AppTheme.colors.emerald }]}>
                        <CheckCircle size={12} color={AppTheme.colors.emerald} />
                        <Text style={[styles.tagText, { color: AppTheme.colors.emerald }]}>{skill}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noData}>No skill matches found</Text>
                  )}
                </View>

                {/* Missing skills */}
                <Text style={styles.resultSection}>⚠️ Missing skills</Text>
                <View style={styles.tagRow}>
                  {analysisResult.missingSkills.map((skill) => (
                    <View key={skill} style={[styles.tag, { borderColor: AppTheme.colors.rose }]}>
                      <XCircle size={12} color={AppTheme.colors.rose} />
                      <Text style={[styles.tagText, { color: AppTheme.colors.rose }]}>{skill}</Text>
                    </View>
                  ))}
                </View>

                {/* Suggestions */}
                <Text style={styles.resultSection}>💡 Suggestions</Text>
                <View style={styles.suggestionList}>
                  {analysisResult.suggestions.map((sug, i) => (
                    <View key={i} style={styles.suggestionItem}>
                      <AlertCircle size={14} color={AppTheme.colors.amber} />
                      <Text style={styles.suggestionText}>{sug}</Text>
                    </View>
                  ))}
                </View>

                <Pressable
                  onPress={() => { setAnalysisResult(null); setJobDescription(""); }}
                  style={styles.analyzeAction}
                >
                  <View style={styles.retryBtn}>
                    <Text style={styles.retryText}>Analyze another job</Text>
                  </View>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 10,
    marginBottom: 16,
  },
  title: { color: AppTheme.colors.text, fontSize: 30, fontWeight: "900" },
  subtitle: { color: AppTheme.colors.textSoft, fontSize: 14, lineHeight: 21, marginTop: 8, maxWidth: 240 },
  analyzeBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppTheme.colors.violet,
  },
  searchBar: {
    height: 54,
    borderRadius: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: AppTheme.colors.surface,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    marginBottom: 4,
  },
  searchInput: { flex: 1, color: AppTheme.colors.text, fontSize: 14 },
  filterChip: {
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  stack: { gap: 12 },
  appRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  appIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(139,92,246,0.2)",
  },
  appBody: { flex: 1 },
  appRole: { color: AppTheme.colors.text, fontSize: 14, fontWeight: "900" },
  appCompany: { color: AppTheme.colors.textMuted, fontSize: 12, marginTop: 3, fontWeight: "600" },
  appRight: { alignItems: "flex-end", gap: 4 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 11, fontWeight: "800" },
  matchScore: { color: AppTheme.colors.emerald, fontSize: 13, fontWeight: "900" },
  // Modal
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: AppTheme.colors.backgroundElevated,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: AppTheme.colors.border,
    maxHeight: "92%",
  },
  sheetContent: { padding: 24, paddingBottom: 48 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sheetTitle: { color: AppTheme.colors.text, fontSize: 20, fontWeight: "900" },
  sheetSub: { color: AppTheme.colors.textMuted, fontSize: 13, marginBottom: 18, lineHeight: 19 },
  descInput: {
    minHeight: 160,
    borderRadius: 18,
    padding: 16,
    color: AppTheme.colors.text,
    fontSize: 14,
    lineHeight: 22,
    backgroundColor: AppTheme.colors.surface,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    textAlignVertical: "top",
    marginBottom: 18,
  },
  analyzeAction: { borderRadius: 18, overflow: "hidden" },
  analyzeCta: { height: 54, alignItems: "center", justifyContent: "center", borderRadius: 18 },
  analyzeCTAText: { color: "#fff", fontSize: 15, fontWeight: "900" },
  resultWrap: { gap: 16 },
  scoreCircleWrap: { alignItems: "center", marginBottom: 8 },
  scoreCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(52,211,153,0.12)",
    borderWidth: 3,
    borderColor: AppTheme.colors.emerald,
  },
  scoreCircleNum: { color: AppTheme.colors.emerald, fontSize: 36, fontWeight: "900" },
  scoreCircleLabel: { color: AppTheme.colors.textMuted, fontSize: 12, fontWeight: "700" },
  resultSection: { color: AppTheme.colors.text, fontSize: 14, fontWeight: "800" },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  tagText: { fontSize: 12, fontWeight: "700" },
  noData: { color: AppTheme.colors.textMuted, fontSize: 13 },
  suggestionList: { gap: 10 },
  suggestionItem: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  suggestionText: { flex: 1, color: AppTheme.colors.textSoft, fontSize: 13, lineHeight: 20 },
  retryBtn: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface,
  },
  retryText: { color: AppTheme.colors.text, fontSize: 14, fontWeight: "800" },
});
