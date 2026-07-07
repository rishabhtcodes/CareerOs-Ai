import { StyleSheet, Text, View } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { AppTheme } from "@/constants/theme";

interface Props {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon: Icon, title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon size={28} color={AppTheme.colors.textMuted} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 14,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  title: {
    color: AppTheme.colors.text,
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: AppTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 260,
  },
});
