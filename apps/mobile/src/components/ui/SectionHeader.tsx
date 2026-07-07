import { StyleSheet, Text, View } from "react-native";
import { AppTheme } from "@/constants/theme";

interface SectionHeaderProps {
  title: string;
  action?: string;
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 12
  },
  title: {
    color: AppTheme.colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  action: {
    color: AppTheme.colors.textMuted,
    fontSize: 13,
    fontWeight: "700"
  }
});
