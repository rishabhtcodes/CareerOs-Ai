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
import { ArrowLeft, Mail, Sparkles } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppTheme } from "@/constants/theme";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setError(null);
    setIsLoading(true);
    // Simulate API call — real implementation goes in auth.service
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    setSubmitted(true);
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
        <View style={styles.glow} pointerEvents="none" />

        {/* Back */}
        <Link href="/auth/login" asChild>
          <Pressable style={styles.backBtn}>
            <ArrowLeft size={20} color={AppTheme.colors.text} />
          </Pressable>
        </Link>

        <View style={styles.logoWrap}>
          <LinearGradient
            colors={["rgba(56,189,248,0.28)", "rgba(139,92,246,0.18)"]}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Sparkles size={28} color={AppTheme.colors.text} />
          </LinearGradient>
        </View>

        {submitted ? (
          <>
            <Text style={styles.title}>Check your inbox</Text>
            <Text style={styles.subtitle}>
              We've sent a password reset link to{"\n"}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>
            <Link href="/auth/login" asChild>
              <Pressable style={styles.ctaOuter}>
                <LinearGradient
                  colors={[AppTheme.colors.violet, AppTheme.colors.magenta]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.cta}
                >
                  <Text style={styles.ctaText}>Back to sign in</Text>
                </LinearGradient>
              </Pressable>
            </Link>
          </>
        ) : (
          <>
            <Text style={styles.title}>Reset password</Text>
            <Text style={styles.subtitle}>
              Enter your email and we'll send you a reset link.
            </Text>

            <View style={styles.form}>
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

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Pressable
                onPress={handleSubmit}
                disabled={isLoading}
                style={({ pressed }) => [styles.ctaOuter, pressed && { opacity: 0.82 }]}
              >
                <LinearGradient
                  colors={[AppTheme.colors.cyan, AppTheme.colors.violet]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.cta}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.ctaText}>Send reset link</Text>
                  )}
                </LinearGradient>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: AppTheme.colors.background },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 48,
    alignItems: "center",
  },
  glow: {
    position: "absolute",
    top: -40,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(56,189,248,0.08)",
  },
  backBtn: {
    alignSelf: "flex-start",
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppTheme.colors.surface,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    marginBottom: 32,
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
    lineHeight: 22,
  },
  emailHighlight: {
    color: AppTheme.colors.cyan,
    fontWeight: "700",
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
  input: { flex: 1, color: AppTheme.colors.text, fontSize: 15 },
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
});
