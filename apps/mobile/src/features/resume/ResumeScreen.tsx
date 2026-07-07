import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Download, FileCheck2, FileText, Plus, X } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "@/components/layout/Screen";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { AppTheme } from "@/constants/theme";
import { useResumes, useGenerateResume } from "@/hooks/useResumes";
import type { ResumeType } from "@/services/api/resume";

const RESUME_TYPES: { type: ResumeType; label: string; description: string; color: string }[] = [
  { type: "frontend", label: "Frontend", description: "React, TypeScript, CSS, animations", color: AppTheme.colors.cyan },
  { type: "fullstack", label: "Full Stack", description: "React + Node.js + PostgreSQL", color: AppTheme.colors.violet },
  { type: "python", label: "Python", description: "Django, FastAPI, data science", color: AppTheme.colors.emerald },
  { type: "ai", label: "AI Engineer", description: "ML, LLMs, Gemini, PyTorch", color: AppTheme.colors.amber },
  { type: "custom", label: "Custom", description: "Paste a job description to tailor", color: AppTheme.colors.magenta },
];

export function ResumeScreen() {
  const { data: resumes, isLoading, refetch } = useResumes();
  const { mutate: generate, isPending } = useGenerateResume();
  const [modalVisible, setModalVisible] = useState(false);

  function handleGenerate(type: ResumeType) {
    generate({ type }, { onSuccess: () => setModalVisible(false) });
  }

  const bestScore = resumes?.length
    ? Math.max(...resumes.map((r) => r.atsScore))
    : 0;

  return (
    <Screen onRefresh={refetch}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My resumes</Text>
          <Text style={styles.subtitle}>Generate targeted resumes from your career profile.</Text>
        </View>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
          activeOpacity={0.8}
        >
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ATS Hero */}
      <GlassCard style={styles.scoreCard}>
        <View style={styles.row}>
          <View style={styles.iconTile}>
            <FileCheck2 size={24} color={AppTheme.colors.text} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>ATS readiness</Text>
            <Text style={styles.muted}>
              {isLoading ? "Calculating..." : `Best score across ${resumes?.length ?? 0} resume${resumes?.length !== 1 ? "s" : ""}`}
            </Text>
          </View>
          <Text style={styles.bigScore}>{isLoading ? "—" : bestScore || "—"}</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${isLoading ? 0 : bestScore}%` }]} />
        </View>
        <GradientButton label="Generate new resume" onPress={() => setModalVisible(true)} />
      </GlassCard>

      {/* Resume Library */}
      <SectionHeader title="Resume library" action={`${resumes?.length ?? 0} resumes`} />
      <View style={styles.stack}>
        {isLoading ? (
          <>
            <Skeleton height={72} borderRadius={18} />
            <Skeleton height={72} borderRadius={18} />
            <Skeleton height={72} borderRadius={18} />
          </>
        ) : !resumes?.length ? (
          <EmptyState
            icon={FileText}
            title="No resumes yet"
            subtitle="Tap + to generate your first AI-targeted resume"
          />
        ) : (
          resumes.map((resume) => (
            <GlassCard key={resume.id}>
              <View style={styles.row}>
                <View style={styles.flex}>
                  <Text style={styles.cardTitle}>{resume.title}</Text>
                  <Text style={styles.muted}>
                    {resume.type.toUpperCase()} •{" "}
                    {new Date(resume.updatedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </Text>
                </View>
                <Text style={styles.resumeScore}>{resume.atsScore}</Text>
                <TouchableOpacity hitSlop={12}>
                  <Download size={19} color={AppTheme.colors.textMuted} />
                </TouchableOpacity>
              </View>
            </GlassCard>
          ))
        )}
      </View>

      {/* Generate Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose resume type</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} hitSlop={12}>
                <X size={22} color={AppTheme.colors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              AI generates a profile-tailored resume optimised for ATS.
            </Text>
            <View style={styles.typeList}>
              {RESUME_TYPES.map((item) => (
                <Pressable
                  key={item.type}
                  onPress={() => handleGenerate(item.type)}
                  disabled={isPending}
                  style={({ pressed }) => [styles.typeCard, pressed && { opacity: 0.75 }]}
                >
                  <View style={[styles.typeDot, { backgroundColor: item.color }]} />
                  <View style={styles.flex}>
                    <Text style={styles.typeLabel}>{item.label}</Text>
                    <Text style={styles.typeDesc}>{item.description}</Text>
                  </View>
                  {isPending ? (
                    <ActivityIndicator size="small" color={item.color} />
                  ) : null}
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    marginTop: 10,
    marginBottom: 18,
  },
  title: { color: AppTheme.colors.text, fontSize: 30, fontWeight: "900" },
  subtitle: { color: AppTheme.colors.textSoft, maxWidth: 260, fontSize: 14, lineHeight: 21, marginTop: 8 },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppTheme.colors.violet,
  },
  scoreCard: { marginBottom: 2 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  flex: { flex: 1 },
  iconTile: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(232,121,249,0.18)",
  },
  cardTitle: { color: AppTheme.colors.text, fontSize: 16, fontWeight: "900" },
  muted: { color: AppTheme.colors.textMuted, marginTop: 5, fontSize: 12, lineHeight: 17 },
  bigScore: { color: AppTheme.colors.emerald, fontSize: 32, fontWeight: "900" },
  progressTrack: {
    height: 8,
    borderRadius: 99,
    marginVertical: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 99, backgroundColor: AppTheme.colors.violet },
  stack: { gap: 12 },
  resumeScore: { color: AppTheme.colors.emerald, fontSize: 18, fontWeight: "900" },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: AppTheme.colors.backgroundElevated,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: { color: AppTheme.colors.text, fontSize: 20, fontWeight: "900" },
  modalSubtitle: { color: AppTheme.colors.textMuted, fontSize: 13, marginBottom: 20, lineHeight: 19 },
  typeList: { gap: 12 },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    backgroundColor: AppTheme.colors.surface,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  typeDot: { width: 12, height: 12, borderRadius: 6 },
  typeLabel: { color: AppTheme.colors.text, fontSize: 15, fontWeight: "800" },
  typeDesc: { color: AppTheme.colors.textMuted, fontSize: 12, marginTop: 3 },
});
