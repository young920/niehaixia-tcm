"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  liujing?: string;
}

const LIUJING_LABELS: Record<string, string> = {
  taiyang: "太阳",
  yangming: "阳明",
  shaoyang: "少阳",
  taiyin: "太阴",
  shaoyin: "少阴",
  jueyin: "厥阴",
};

const QUICK_STARTS = [
  "我感冒了，怕冷，没有汗，脖子后面疼",
  "口苦、咽干、目眩，往来寒热",
  "胃中不适，吃不下东西，手脚冷",
  "失眠、心烦、手脚心热",
];

export default function WenzhenPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text.trim(),
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/wenzhen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: data.content,
        liujing: data.liujing,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          content: "抱歉，问诊服务暂时不可用，请稍后重试。",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col max-h-screen">
          {/* Chat Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-[var(--grid-outer)] py-6 lg:px-16">
            {/* Empty State */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="font-serif text-2xl text-accent-ink mb-3">经方 AI 问诊</h2>
                <p className="text-fg-muted text-sm mb-8 max-w-md">
                  以倪海厦六经辨证思维引导问诊，请描述您的症状
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                  {QUICK_STARTS.map((qs) => (
                    <button
                      key={qs}
                      onClick={() => sendMessage(qs)}
                      className="text-left text-sm text-fg-secondary bg-bg-card rounded-[var(--card-radius)] p-3 shadow-[var(--shadow-card)] transition-shadow duration-[var(--transition-fast)] hover:shadow-[var(--shadow-thumbnail)]"
                    >
                      {qs}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-2xl mb-4 ${msg.role === "user" ? "ml-auto" : "mr-auto"}`}
              >
                <div
                  className={`rounded-[var(--card-radius)] px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-accent-primary text-fg-inverse"
                      : "bg-bg-card shadow-[var(--shadow-card)]"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.liujing && (
                  <div className="mt-1.5">
                    <Tag variant={msg.liujing as "taiyang" | "yangming" | "shaoyang" | "taiyin" | "shaoyin" | "jueyin"}>
                      {LIUJING_LABELS[msg.liujing] ?? msg.liujing}经
                    </Tag>
                  </div>
                )}
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="max-w-2xl mr-auto mb-4">
                <div className="bg-bg-card shadow-[var(--shadow-card)] rounded-[var(--card-radius)] px-5 py-4 text-sm text-fg-muted">
                  倪师正在辨证...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-fg-muted/10 bg-bg-base px-[var(--grid-outer)] py-4 lg:px-16">
            <div className="flex gap-3 max-w-2xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="描述症状，如：怕冷、无汗、脖子疼..."
                className="flex-1 bg-bg-card-solid rounded-[var(--card-radius)] border border-fg-muted/20 px-4 py-2.5 text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:border-accent-primary/50"
                disabled={loading}
              />
              <Button
                variant="primary"
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
              >
                问诊
              </Button>
            </div>
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
