import { Tabs } from "expo-router";
import { BriefcaseBusiness, Bot, FileText, Home, Search, UserRound } from "lucide-react-native";
import { AppTheme } from "@/constants/theme";

const tabIconColor = (focused: boolean) =>
  focused ? AppTheme.colors.text : AppTheme.colors.textMuted;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: AppTheme.colors.text,
        tabBarInactiveTintColor: AppTheme.colors.textMuted,
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 18,
          height: 72,
          borderRadius: 24,
          borderTopWidth: 1,
          borderColor: "rgba(255,255,255,0.08)",
          backgroundColor: "rgba(12, 17, 31, 0.94)",
          paddingTop: 10,
          paddingBottom: 10
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600"
        }
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ focused }) => <Home size={20} color={tabIconColor(focused)} /> }} />
      <Tabs.Screen name="jobs" options={{ title: "Jobs", tabBarIcon: ({ focused }) => <Search size={20} color={tabIconColor(focused)} /> }} />
      <Tabs.Screen name="resume" options={{ title: "Resume", tabBarIcon: ({ focused }) => <FileText size={20} color={tabIconColor(focused)} /> }} />
      <Tabs.Screen name="coach" options={{ title: "AI", tabBarIcon: ({ focused }) => <Bot size={20} color={tabIconColor(focused)} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ focused }) => <UserRound size={20} color={tabIconColor(focused)} /> }} />
    </Tabs>
  );
}
