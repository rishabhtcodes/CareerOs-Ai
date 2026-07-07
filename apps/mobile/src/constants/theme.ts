import { MD3DarkTheme } from "react-native-paper";

export const AppTheme = {
  colors: {
    background: "#05070f",
    backgroundElevated: "#0b1020",
    surface: "rgba(18, 25, 43, 0.78)",
    surfaceStrong: "#121a2f",
    border: "rgba(255, 255, 255, 0.1)",
    text: "#f7f8ff",
    textSoft: "#cfd6ea",
    textMuted: "#7f89a8",
    violet: "#8b5cf6",
    magenta: "#e879f9",
    cyan: "#38bdf8",
    emerald: "#34d399",
    amber: "#f8b84e",
    rose: "#fb7185"
  },
  radii: {
    sm: 12,
    md: 18,
    lg: 24,
    xl: 30
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 22,
    xl: 32
  }
} as const;

export const paperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: AppTheme.colors.violet,
    secondary: AppTheme.colors.cyan,
    background: AppTheme.colors.background,
    surface: AppTheme.colors.surfaceStrong,
    onSurface: AppTheme.colors.text
  }
};
