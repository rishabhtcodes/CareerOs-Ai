import { useState, type PropsWithChildren } from "react";
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppTheme } from "@/constants/theme";

interface ScreenProps extends PropsWithChildren {
  padded?: boolean;
  onRefresh?: () => any;
}

export function Screen({ children, padded = true, onRefresh }: ScreenProps) {
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["rgba(139,92,246,0.2)", "rgba(56,189,248,0.08)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.glow}
      />
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={[styles.content, padded && styles.padded]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={AppTheme.colors.violet}
                colors={[AppTheme.colors.violet]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  safe: { flex: 1 },
  content: { paddingBottom: 112 },
  padded: { paddingHorizontal: 18 },
  glow: {
    position: "absolute",
    top: -120,
    left: -80,
    right: -80,
    height: 360,
  },
});
