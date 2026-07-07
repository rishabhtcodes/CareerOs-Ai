import { StyleSheet, Text, View } from "react-native";
import type { CareerMetric } from "@careeros/shared";
import { AppTheme } from "@/constants/theme";
import { GlassCard } from "./GlassCard";

const toneMap = {
  violet: AppTheme.colors.violet,
  cyan: AppTheme.colors.cyan,
  emerald: AppTheme.colors.emerald,
  amber: AppTheme.colors.amber,
  rose: AppTheme.colors.rose
};

interface StatCardProps {
  metric: CareerMetric;
}

export function StatCard({ metric }: StatCardProps) {
  return (
    <GlassCard style={styles.card}>
      <View style={[styles.dot, { backgroundColor: toneMap[metric.tone] }]} />
      <Text style={styles.value}>{metric.value}</Text>
      <Text style={styles.label}>{metric.label}</Text>
      {metric.delta ? <Text style={[styles.delta, { color: toneMap[metric.tone] }]}>{metric.delta}</Text> : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%"
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 14
  },
  value: {
    color: AppTheme.colors.text,
    fontSize: 26,
    fontWeight: "900"
  },
  label: {
    color: AppTheme.colors.textMuted,
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600"
  },
  delta: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "800"
  }
});
