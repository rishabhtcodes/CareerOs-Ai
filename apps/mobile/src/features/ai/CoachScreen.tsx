import { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView
} from "react-native";
import { Bot, RotateCcw, Send, Sparkles } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppTheme } from "@/constants/theme";
import { useCoach } from "@/hooks/useCoach";
import { useAuth } from "@/context/AuthContext";

const SUGGESTED_PROMPTS = [
  "How do I become a Full Stack Developer?",
  "What projects should I build for AI roles?",
  "Review my profile and suggest improvements",
  "Create a 30-day learning roadmap for me",
];

export function CoachScreen() {
  const { user } = useAuth();
  const { messages, isLoading, send, clear } = useCoach();
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  async function handleSend() {
    const msg = input.trim();
    if (!msg || isLoading) return;
    setInput("");
    await send(msg);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <LinearGradient
              colors={["rgba(139,92,246,0.35)", "rgba(232,121,249,0.18)"]}
              style={styles.headerIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Bot size={22} color={AppTheme.colors.text} />
            </LinearGradient>
            <View>
              <Text style={styles.headerTitle}>CareerOS AI</Text>
              <Text style={styles.headerSub}>Profile-aware career coach</Text>
            </View>
          </View>
          {messages.length > 0 && (
            <TouchableOpacity onPress={clear} hitSlop={12}>
              <RotateCcw size={18} color={AppTheme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 ? (
            /* Welcome state */
            <>
              <View style={styles.welcomeCard}>
                <View style={styles.welcomeRow}>
                  <Sparkles size={18} color={AppTheme.colors.amber} />
                  <Text style={styles.welcomeTitle}>
                    Hi {user?.name?.split(" ")[0] ?? "there"}. Ready to grow your career?
                  </Text>
                </View>
                <Text style={styles.welcomeBody}>
                  Ask me anything about your career — I'll analyse your profile and give you a
                  personalised plan.
                </Text>
              </View>

              <Text style={styles.suggestionsLabel}>Try asking:</Text>
              <View style={styles.promptList}>
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <TouchableOpacity
                    key={prompt}
                    onPress={() => send(prompt)}
                    style={styles.promptChip}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.promptText}>{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            messages.map((msg, i) => (
              <View
                key={i}
                style={[
                  styles.bubble,
                  msg.role === "user" ? styles.userBubble : styles.aiBubble,
                ]}
              >
                {msg.role === "assistant" && (
                  <View style={styles.aiDot}>
                    <Bot size={13} color={AppTheme.colors.violet} />
                  </View>
                )}
                <Text
                  style={[
                    styles.bubbleText,
                    msg.role === "user" ? styles.userBubbleText : styles.aiBubbleText,
                  ]}
                >
                  {msg.content}
                </Text>
              </View>
            ))
          )}

          {isLoading && (
            <View style={[styles.bubble, styles.aiBubble]}>
              <View style={styles.aiDot}>
                <Bot size={13} color={AppTheme.colors.violet} />
              </View>
              <ActivityIndicator size="small" color={AppTheme.colors.violet} />
            </View>
          )}
        </ScrollView>

        {/* Composer */}
        <View style={styles.composerWrap}>
          <View style={styles.composer}>
            <TextInput
              placeholder="Ask anything about your career…"
              placeholderTextColor={AppTheme.colors.textMuted}
              style={styles.composerInput}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={1000}
              onSubmitEditing={handleSend}
            />
            <Pressable
              onPress={handleSend}
              disabled={!input.trim() || isLoading}
              style={({ pressed }) => [
                styles.sendBtn,
                (!input.trim() || isLoading) && styles.sendBtnDisabled,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Send size={16} color="#fff" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppTheme.colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: AppTheme.colors.text, fontSize: 16, fontWeight: "900" },
  headerSub: { color: AppTheme.colors.textMuted, fontSize: 12, marginTop: 2 },
  messageList: { padding: 18, paddingBottom: 24, gap: 14, flexGrow: 1 },
  welcomeCard: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.surface,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    gap: 12,
    marginBottom: 8,
  },
  welcomeRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  welcomeTitle: {
    flex: 1,
    color: AppTheme.colors.text,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 22,
  },
  welcomeBody: {
    color: AppTheme.colors.textSoft,
    fontSize: 14,
    lineHeight: 22,
  },
  suggestionsLabel: {
    color: AppTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
  promptList: { gap: 10 },
  promptChip: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: AppTheme.colors.surface,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  promptText: { color: AppTheme.colors.text, fontSize: 14, fontWeight: "700" },
  bubble: {
    maxWidth: "85%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    flexDirection: "column",
    backgroundColor: AppTheme.colors.violet,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    padding: 14,
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: AppTheme.colors.surface,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 14,
  },
  aiDot: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(139,92,246,0.18)",
  },
  bubbleText: { fontSize: 14, lineHeight: 22, flexShrink: 1 },
  userBubbleText: { color: "#fff", fontWeight: "600" },
  aiBubbleText: { color: AppTheme.colors.textSoft },
  composerWrap: {
    padding: 14,
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.background,
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: AppTheme.colors.surface,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  composerInput: {
    flex: 1,
    color: AppTheme.colors.text,
    fontSize: 14,
    maxHeight: 100,
    paddingTop: 4,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppTheme.colors.violet,
  },
  sendBtnDisabled: { backgroundColor: "rgba(139,92,246,0.35)" },
});
