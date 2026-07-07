import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link } from "expo-router";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";
import { AppTheme } from "@/constants/theme";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? "Login failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Background glow */}
        <View style={styles.glow} pointerEvents="none" />

        {/* Logo */}
        <View style={styles.logoWrap}>
          <LinearGradient
            colors={["rgba(139,92,246,0.35)", "rgba(232,121,249,0.18)"]}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Sparkles size={28} color={AppTheme.colors.text} />
          </LinearGradient>
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Sign in to your CareerOS AI account
        </Text>

        {/* Form */}
        <View style={styles.form}>
          {/* Email */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <Mail size={17} color={AppTheme.colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={AppTheme.colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Lock size={17} color={AppTheme.colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={AppTheme.colors.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={12}>
                {showPassword ? (
                  <EyeOff size={17} color={AppTheme.colors.textMuted} />
                ) : (
                  <Eye size={17} color={AppTheme.colors.textMuted} />
                )}
              </Pressable>
            </View>
          </View>

          {/* Forgot */}
          <Link href="/auth/forgot-password" asChild>
            <Pressable style={styles.forgotWrap}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          </Link>

          {/* Error */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* CTA */}
          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            style={({ pressed }) => [styles.ctaOuter, pressed && { opacity: 0.82 }]}
          >
            <LinearGradient
              colors={[AppTheme.colors.violet, AppTheme.colors.magenta]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cta}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.ctaText}>Sign in</Text>
              )}
            </LinearGradient>
          </Pressable>
        </View>

        {/* Register link */}
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Don't have an account?</Text>
          <Link href="/auth/register" asChild>
            <Pressable>
              <Text style={styles.footerLink}> Create one</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: AppTheme.colors.background },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 48,
    alignItems: "center",
  },
  glow: {
    position: "absolute",
    top: -60,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "rgba(139,92,246,0.12)",
  },
  logoWrap: { marginBottom: 32 },
  logoGradient: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  title: {
    color: AppTheme.colors.text,
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: AppTheme.colors.textMuted,
    fontSize: 14,
    marginTop: 8,
    marginBottom: 36,
    textAlign: "center",
  },
  form: { width: "100%", gap: 16 },
  fieldWrap: { gap: 8 },
  label: {
    color: AppTheme.colors.textSoft,
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 54,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: AppTheme.colors.surface,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  input: {
    flex: 1,
    color: AppTheme.colors.text,
    fontSize: 15,
  },
  forgotWrap: { alignSelf: "flex-end", marginTop: -4 },
  forgotText: {
    color: AppTheme.colors.violet,
    fontSize: 13,
    fontWeight: "700",
  },
  errorText: {
    color: AppTheme.colors.rose,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  ctaOuter: { borderRadius: 18, overflow: "hidden", marginTop: 8 },
  cta: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  footerRow: {
    flexDirection: "row",
    marginTop: 32,
    alignItems: "center",
  },
  footerLabel: {
    color: AppTheme.colors.textMuted,
    fontSize: 14,
  },
  footerLink: {
    color: AppTheme.colors.violet,
    fontSize: 14,
    fontWeight: "800",
  },
});
