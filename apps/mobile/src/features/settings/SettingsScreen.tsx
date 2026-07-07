import { StyleSheet, Text, View } from "react-native";
import { Moon, Sun, Monitor, Bell, Shield, ChevronRight } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppTheme } from "@/constants/theme";

export function SettingsScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <SectionHeader title="Appearance" />
      <GlassCard>
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <Monitor size={18} color={AppTheme.colors.text} />
          </View>
          <Text style={styles.label}>System Default</Text>
          <View style={styles.activeDot} />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <Moon size={18} color={AppTheme.colors.text} />
          </View>
          <Text style={styles.label}>Dark Mode (Premium)</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <Sun size={18} color={AppTheme.colors.text} />
          </View>
          <Text style={styles.label}>Light Mode</Text>
        </View>
      </GlassCard>

      <SectionHeader title="Preferences" />
      <GlassCard>
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <Bell size={18} color={AppTheme.colors.text} />
          </View>
          <Text style={styles.label}>Push Notifications</Text>
          <ChevronRight size={18} color={AppTheme.colors.textMuted} />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <Shield size={18} color={AppTheme.colors.text} />
          </View>
          <Text style={styles.label}>Privacy Settings</Text>
          <ChevronRight size={18} color={AppTheme.colors.textMuted} />
        </View>
      </GlassCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20, marginTop: 10 },
  title: { color: AppTheme.colors.text, fontSize: 30, fontWeight: "900" },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  label: { flex: 1, color: AppTheme.colors.text, fontSize: 15, fontWeight: "600" },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: AppTheme.colors.violet },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.06)", marginVertical: 8 },
});
