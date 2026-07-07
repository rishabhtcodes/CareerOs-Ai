import { StyleSheet, Text, View } from "react-native";
import { ChevronRight, KeyRound, Smartphone, ShieldCheck } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppTheme } from "@/constants/theme";

export default function SecurityScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Security</Text>
        <Text style={styles.subtitle}>Manage your account security and authentication methods.</Text>
      </View>

      <SectionHeader title="Login Methods" />
      <GlassCard>
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <KeyRound size={18} color={AppTheme.colors.text} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.label}>Password</Text>
            <Text style={styles.desc}>Last changed 3 months ago</Text>
          </View>
          <ChevronRight size={18} color={AppTheme.colors.textMuted} />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <Smartphone size={18} color={AppTheme.colors.text} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.label}>Two-Factor Authentication</Text>
            <Text style={styles.desc}>Off</Text>
          </View>
          <ChevronRight size={18} color={AppTheme.colors.textMuted} />
        </View>
      </GlassCard>

      <SectionHeader title="Data & Privacy" />
      <GlassCard>
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <ShieldCheck size={18} color={AppTheme.colors.text} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.label}>Data Export</Text>
            <Text style={styles.desc}>Download a copy of your career data</Text>
          </View>
          <ChevronRight size={18} color={AppTheme.colors.textMuted} />
        </View>
      </GlassCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20, marginTop: 10 },
  title: { color: AppTheme.colors.text, fontSize: 30, fontWeight: "900" },
  subtitle: { color: AppTheme.colors.textSoft, fontSize: 14, lineHeight: 21, marginTop: 8 },
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
  desc: { color: AppTheme.colors.textMuted, fontSize: 12, marginTop: 2 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.06)", marginVertical: 8 },
});
