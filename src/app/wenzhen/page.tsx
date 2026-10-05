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
 * 师徒对答 — 问诊页面
 * 非聊天界面，而是师徒问答的书写式布局
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
          {/* 对答区域 */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-[var(--grid-outer)] py-8 lg:px-16">
            {/* 空状态 — 处方笺 */}
            {messages.length === 0 && (
              <div className="max-w-2xl mx-auto">
                <div className="border-t border-brass pt-4 mb-8">
                  <h2 className="font-serif text-2xl text-accent-ink">经方问诊</h2>
                  <p className="text-ink-light text-sm mt-1">以倪海厦六经辨证思维引导问诊</p>
                </div>

                {/* 处方笺表单感 */}
                <div className="border border-divider-wood bg-bg-card p-6 mb-8">
                  <div className="space-y-4">
                    <div className="border-b border-divider-wood pb-3">
                      <span className="font-serif text-sm text-brass">主诉</span>
                      <p className="text-ink-light text-sm mt-1">请描述您的主要症状与不适</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "寒热", hint: "怕冷/发热" },
                        { label: "汗出", hint: "有汗/无汗" },
                        { label: "头身", hint: "头痛/身重" },
                      ].map((field) => (
                        <div key={field.label} className="border-b border-divider-wood pb-2">
                          <span className="font-serif text-xs text-brass">{field.label}</span>
                          <p className="text-ink-light text-xs mt-0.5">{field.hint}</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "二便", hint: "大便/小便" },
                        { label: "饮食", hint: "口渴/食欲" },
                        { label: "睡眠", hint: "失眠/嗜卧" },
                      ].map((field) => (
                        <div key={field.label} className="border-b border-divider-wood pb-2">
                          <span className="font-serif text-xs text-brass">{field.label}</span>
                          <p className="text-ink-light text-xs mt-0.5">{field.hint}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 常见症状快捷条目 */}
                <div className="space-y-2">
                  <p className="text-xs text-ink-light font-serif mb-2">常见症状</p>
                  {PRESET_SYMPTOMS.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => sendMessage(symptom)}
                      className="block w-full text-left text-sm text-fg-secondary bg-transparent border-b border-divider-wood py-2.5 px-1 font-serif transition-[color,border-color] duration-[var(--transition-fast)] hover:text-accent-primary hover:border-accent-primary/30"
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 师徒对答 */}
            {messages.map((msg) => (
              <div key={msg.id} className="max-w-2xl mx-auto mb-6">
                <div
                  className="border-b-2 pl-4 py-4"
                  style={{
                    borderLeftColor: msg.role === "user" ? "var(--color-brass)" : "var(--accent-primary)",
                    borderLeftWidth: "3px",
                    backgroundColor: msg.role === "user" ? "var(--bg-surface)" : "transparent",
                  }}
                >
                  <span
                    className="text-xs font-serif mb-2 block"
                    style={{
                      color: msg.role === "user" ? "var(--color-brass)" : "var(--accent-primary)",
                    }}
                  >
                    {msg.role === "user" ? "问" : "答"}
                  </span>
                  <p className="text-sm text-fg-primary leading-relaxed whitespace-pre-wrap">
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

            {/* Loading */}
            {loading && (
              <div className="max-w-2xl mx-auto mb-6">
                <div
                  className="border-l-2 pl-4 py-4"
                  style={{
                    borderLeftColor: "var(--accent-primary)",
                    borderLeftWidth: "3px",
                  }}
                >
                  <span className="text-xs font-serif text-accent-primary mb-2 block">答</span>
                  <p className="text-sm text-ink-light">倪师正在辨证…</p>
                </div>
              </div>
            )}
          </div>

          {/* 输入区 — 处方笺底部 */}
          <div className="border-t border-divider-wood bg-bg-base px-[var(--grid-outer)] py-4 lg:px-16">
            <div className="flex gap-3 max-w-2xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="描述症状…"
                className="flex-1 bg-transparent border-b border-wood px-2 py-2.5 text-sm text-fg-primary font-serif placeholder:text-ink-light/50 focus:outline-none focus:border-accent-primary transition-[border-color] duration-[var(--transition-fast)]"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="text-sm font-serif text-brass px-4 py-2 border border-wood transition-[background-color,color,border-color] duration-[var(--transition-fast)] hover:bg-accent-primary hover:text-fg-inverse hover:border-accent-primary disabled:opacity-40 disabled:pointer-events-none"
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
