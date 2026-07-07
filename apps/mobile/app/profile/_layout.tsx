import { Stack } from "expo-router";

export default function ProfileSubLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#0C111F" },
        headerTintColor: "#fff",
        headerBackTitle: "Back",
        contentStyle: { backgroundColor: "#0C111F" },
      }}
    >
      <Stack.Screen name="github" options={{ title: "GitHub" }} />
      <Stack.Screen name="ai-settings" options={{ title: "AI Preferences" }} />
      <Stack.Screen name="security" options={{ title: "Security" }} />
    </Stack>
  );
}
