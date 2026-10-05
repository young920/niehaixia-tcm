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
 * 铜版药典 问诊 — 临床病案记录式
 * 非聊天界面，而是病案格式的书写式布局
 * 每条对答如病案中的"主诉""辨证"条目
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
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-[var(--grid-outer)] py-8 lg:px-16">
            {/* 空状态 — 病案首页格式 */}
            {messages.length === 0 && (
              <div className="max-w-2xl mx-auto">
                <div className="section-title pt-4 mb-8">
                  <h2 className="font-serif text-2xl text-accent-ink">经方问诊</h2>
                  <p className="engraving-label mt-2">CONSULTATIO · EXAMINATIO · DIAGNOSIS</p>
                </div>

                <div className="plate-frame p-6 mb-8">
                  <div className="space-y-4">
                    <div className="border-b border-divider-rule pb-3">
                      <span className="engraving-label">CHIEF COMPLAINT · 主诉</span>
                      <p className="text-fg-muted text-sm font-serif mt-1">请描述您的主要症状与不适</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "寒热", sub: "CHILL & FEVER" },
                        { label: "汗出", sub: "SWEATING" },
                        { label: "头身", sub: "HEAD & BODY" },
                      ].map((field) => (
                        <div key={field.label} className="border-b border-divider-rule pb-2">
                          <span className="font-serif text-sm text-copper">{field.label}</span>
                          <p className="engraving-label mt-0.5">{field.sub}</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "二便", sub: "EXCRETION" },
                        { label: "饮食", sub: "APPETITE" },
                        { label: "睡眠", sub: "SLEEP" },
                      ].map((field) => (
                        <div key={field.label} className="border-b border-divider-rule pb-2">
                          <span className="font-serif text-sm text-copper">{field.label}</span>
                          <p className="engraving-label mt-0.5">{field.sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="engraving-label mb-2">COMMON SYMPTOMS · 常见症状</p>
                  {PRESET_SYMPTOMS.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => sendMessage(symptom)}
                      className="block w-full text-left text-sm text-fg-secondary bg-transparent border-b border-divider-rule py-2.5 px-1 font-serif transition-[color,border-color] duration-[var(--transition-fast)] hover:text-accent-primary hover:border-copper/30"
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={msg.id} className="max-w-2xl mx-auto mb-6">
                <div
                  className="border-l-2 pl-4 py-4"
                  style={{
                    borderLeftColor: msg.role === "user" ? "var(--color-copper)" : "var(--accent-primary)",
                    borderLeftWidth: "3px",
                    backgroundColor: msg.role === "user" ? "var(--bg-surface)" : "transparent",
                  }}
                >
                  <span className="engraving-label mb-2 block">
                    {msg.role === "user" ? `§${i + 1} INTERROGATIO · 问` : `§${i + 1} DIAGNOSIS · 辨`}
                  </span>
                  <p className="text-sm text-fg-primary leading-relaxed whitespace-pre-wrap font-serif">
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
              <div className="max-w-2xl mx-auto mb-6">
                <div
                  className="border-l-2 pl-4 py-4"
                  style={{
                    borderLeftColor: "var(--accent-primary)",
                    borderLeftWidth: "3px",
                  }}
                >
                  <span className="engraving-label mb-2 block">DIAGNOSIS · 辨</span>
                  <p className="text-sm text-fg-muted font-serif">倪师正在辨证…</p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-divider-rule bg-bg-base px-[var(--grid-outer)] py-4 lg:px-16">
            <div className="flex gap-3 max-w-2xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="描述症状…"
                className="flex-1 bg-transparent border-b border-sepia px-2 py-2.5 text-sm text-fg-primary font-serif placeholder:text-fg-muted/50 focus:outline-none focus:border-copper transition-[border-color] duration-[var(--transition-fast)]"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="text-sm font-serif text-copper px-4 py-2 border border-copper tracking-wider transition-[background-color,color,border-color] duration-[var(--transition-fast)] hover:bg-copper hover:text-fg-inverse hover:border-copper disabled:opacity-40 disabled:pointer-events-none"
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
