"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";
import { Tag } from "@/components/ui/tag";

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

const PRESET_SYMPTOMS = [
  "恶寒发热、头项强痛",
  "口苦咽干、往来寒热",
  "腹满而吐、食不下",
  "失眠心烦、手足心热",
];

/**
 * 一保堂式 问诊 — 极简、轻盈
 */
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
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-[var(--grid-outer)] py-12 lg:px-20">
            {messages.length === 0 && (
              <div className="max-w-xl mx-auto">
                <div className="section-title pt-2 mb-10">
                  <h2 className="font-sans text-lg text-fg-primary mb-1">经方问诊</h2>
                  <p className="engraving-label">CONSULTATION</p>
                </div>

                <div className="mb-10">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "寒热", sub: "Chill & Fever" },
                      { label: "汗出", sub: "Sweating" },
                      { label: "头身", sub: "Head & Body" },
                    ].map((field) => (
                      <div key={field.label} className="border-b border-[var(--border-copper)] pb-3">
                        <span className="font-sans text-sm text-fg-secondary">{field.label}</span>
                        <p className="text-[0.6rem] text-fg-muted mt-0.5">{field.sub}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "二便", sub: "Excretion" },
                      { label: "饮食", sub: "Appetite" },
                      { label: "睡眠", sub: "Sleep" },
                    ].map((field) => (
                      <div key={field.label} className="border-b border-[var(--border-copper)] pb-3">
                        <span className="font-sans text-sm text-fg-secondary">{field.label}</span>
                        <p className="text-[0.6rem] text-fg-muted mt-0.5">{field.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-fg-muted mb-3">常见症状</p>
                  {PRESET_SYMPTOMS.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => sendMessage(symptom)}
                      className="block w-full text-left text-sm text-fg-secondary bg-transparent border-b border-[var(--border-copper)] py-3 px-0 font-sans transition-colors duration-[var(--transition-fast)] hover:text-fg-primary"
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={msg.id} className="max-w-xl mx-auto mb-6">
                <div
                  className="border-l-2 pl-4 py-3"
                  style={{
                    borderLeftColor: msg.role === "user" ? "var(--fg-muted)" : "var(--accent-primary)",
                    backgroundColor: msg.role === "user" ? "var(--bg-surface)" : "transparent",
                  }}
                >
                  <p className="text-sm text-fg-primary leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.content}
                  </p>
                </div>
                {msg.liujing && (
                  <div className="mt-2 pl-4">
                    <Tag variant={msg.liujing as "taiyang" | "yangming" | "shaoyang" | "taiyin" | "shaoyin" | "jueyin"}>
                      {LIUJING_LABELS[msg.liujing] ?? msg.liujing}经
                    </Tag>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="max-w-xl mx-auto mb-6">
                <div className="border-l-2 pl-4 py-3" style={{ borderLeftColor: "var(--accent-primary)" }}>
                  <p className="text-sm text-fg-muted font-sans">正在辨证…</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-bg-base border-t border-[var(--border-copper)] px-[var(--grid-outer)] py-3 lg:px-20">
            <div className="flex gap-3 max-w-xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="描述症状…"
                className="flex-1 bg-transparent border-b border-[var(--border-copper-thick)] px-1 py-2 text-sm text-fg-primary font-sans placeholder:text-fg-muted/40 focus:outline-none focus:border-accent-primary transition-[border-color] duration-[var(--transition-fast)]"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="text-sm font-sans text-fg-inverse bg-accent-primary rounded-[var(--card-radius)] px-5 py-2 tracking-wider transition-[opacity] duration-[var(--transition-fast)] hover:opacity-85 disabled:opacity-30 disabled:pointer-events-none"
              >
                问诊
              </button>
            </div>
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
