import { useCallback, useState } from "react";
import { sendCoachMessage, type CoachMessage } from "@/services/api/ai";

export function useCoach() {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const send = useCallback(async (content: string) => {
    const userMsg: CoachMessage = { role: "user", content, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    try {
      const { response } = await sendCoachMessage(content);
      const assistantMsg: CoachMessage = {
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: CoachMessage = {
        role: "assistant",
        content: "Sorry, I couldn't reach the server. Please try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => setMessages([]), []);

  return { messages, isLoading, send, clear };
}
