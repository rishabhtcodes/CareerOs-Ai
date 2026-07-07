import type { PropsWithChildren } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { AppTheme } from "@/constants/theme";

interface GlassCardProps extends PropsWithChildren {
  style?: ViewStyle;
  intensity?: number;
}

export function GlassCard({ children, style, intensity = 24 }: GlassCardProps) {
  return (
    <View style={[styles.shadow, style]}>
      <BlurView intensity={intensity} tint="dark" style={styles.blur}>
        <LinearGradient
          colors={["rgba(255,255,255,0.09)", "rgba(255,255,255,0.025)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.inner}
        >
          {children}
        </LinearGradient>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: AppTheme.radii.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface
  },
  blur: {
    overflow: "hidden"
  },
  inner: {
    padding: 16
  }
});
