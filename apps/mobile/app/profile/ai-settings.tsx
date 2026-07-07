import { StyleSheet, Switch, Text, View } from "react-native";
import { useState } from "react";
import { Bot, Sparkles, Sliders } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppTheme } from "@/constants/theme";

export default function AISettingsScreen() {
  const [useProfileData, setUseProfileData] = useState(true);
  const [proactiveSuggestions, setProactiveSuggestions] = useState(true);
  const [strictMode, setStrictMode] = useState(false);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>AI Preferences</Text>
        <Text style={styles.subtitle}>Customize how the CareerOS AI assists you.</Text>
      </View>

      <SectionHeader title="Context & Data" />
      <GlassCard>
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <Bot size={18} color={AppTheme.colors.text} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.label}>Use profile context</Text>
            <Text style={styles.desc}>Allow AI to read your skills and experience to tailor answers.</Text>
          </View>
          <Switch
            value={useProfileData}
            onValueChange={setUseProfileData}
            trackColor={{ true: AppTheme.colors.violet }}
          />
        </View>
      </GlassCard>

      <SectionHeader title="Behavior" />
      <GlassCard style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <Sparkles size={18} color={AppTheme.colors.text} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.label}>Proactive Suggestions</Text>
            <Text style={styles.desc}>AI will automatically suggest resume updates when you change your profile.</Text>
          </View>
          <Switch
            value={proactiveSuggestions}
            onValueChange={setProactiveSuggestions}
            trackColor={{ true: AppTheme.colors.violet }}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <Sliders size={18} color={AppTheme.colors.text} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.label}>Strict Mode</Text>
            <Text style={styles.desc}>AI will only generate resumes based on explicitly listed skills.</Text>
          </View>
          <Switch
            value={strictMode}
            onValueChange={setStrictMode}
            trackColor={{ true: AppTheme.colors.violet }}
          />
        </View>
      </GlassCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20, marginTop: 10 },
  title: { color: AppTheme.colors.text, fontSize: 30, fontWeight: "900" },
  subtitle: { color: AppTheme.colors.textSoft, fontSize: 14, lineHeight: 21, marginTop: 8 },
  card: { gap: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  textWrap: { flex: 1 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  label: { color: AppTheme.colors.text, fontSize: 15, fontWeight: "600" },
  desc: { color: AppTheme.colors.textMuted, fontSize: 12, marginTop: 2, lineHeight: 18 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.06)", marginVertical: 8 },
});
