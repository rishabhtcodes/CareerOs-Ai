import { StyleSheet, View } from "react-native";
import { AppTheme } from "@/constants/theme";

interface Props {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: object;
}

export function Skeleton({ width = "100%", height = 18, borderRadius = 10, style }: Props) {
  return <View style={[styles.base, { width: width as any, height, borderRadius }, style]} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: "rgba(255,255,255,0.07)",
  },
});
