"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChatStorage } from "@/hooks/chatStorage";
import { ChatMessage } from "@/types/chat";

export default function HomePage() {
  const [userId] = useState("user01");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !query.trim() || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const newChat = ChatStorage.createChat(query.trim(), userId);

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user" as const,
        question: query.trim(),
        timestamp: new Date(),
      };

      newChat.messages.push(userMessage);
      ChatStorage.addMessage(newChat.id, userMessage);
      router.push(`/chat/${newChat.id}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to create chat:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && query.trim()) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const examples = [
    "Can you explain me the database?",
    "What's the total revenue for last month?",
    "List the top 5 products by sales",
    "Find customers who haven't ordered recently",
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex items-center justify-center min-h-full p-8">
        <div className="w-full max-w-2xl space-y-8">
          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-medium" htmlFor="query">
                  Ask a question
                </Label>
                <div className="relative">
                  <Textarea
                    className="resize-none text-base pr-12 min-h-[120px]"
                    disabled={isLoading}
                    id="query"
                    placeholder="e.g., Show me the top 10 customers by revenue this month"
                    rows={4}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    className="absolute bottom-3 right-3 h-8 w-8"
                    disabled={isLoading || !userId || !query.trim()}
                    size="icon"
                    type="submit"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Press Enter to send, or click the send button
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
