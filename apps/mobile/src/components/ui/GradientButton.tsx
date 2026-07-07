import { Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight } from "lucide-react-native";
import { AppTheme } from "@/constants/theme";

interface GradientButtonProps {
  label: string;
  onPress?: () => void;
}

export function GradientButton({ label, onPress }: GradientButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <LinearGradient colors={[AppTheme.colors.violet, AppTheme.colors.magenta]} style={styles.gradient}>
        <Text style={styles.label}>{label}</Text>
        <ArrowRight size={17} color={AppTheme.colors.text} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: AppTheme.radii.md,
    overflow: "hidden"
  },
  gradient: {
    height: 52,
    paddingHorizontal: 18,
    borderRadius: AppTheme.radii.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10
  },
  label: {
    color: AppTheme.colors.text,
    fontSize: 15,
    fontWeight: "800"
  }
});
