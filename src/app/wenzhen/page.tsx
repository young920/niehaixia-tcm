"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";
import { Tag } from "@/components/ui/tag";
import { Markdown } from "@/components/ui/markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  liujing?: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

const STORAGE_KEY = "wenzhen-conversations";

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

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveConversations(convs: Conversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
  } catch {
    // localStorage full or unavailable
  }
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 一保堂式 问诊 — 极简、轻盈 + 对话历史
 */
export default function WenzhenPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setConversations(loadConversations());
    setMounted(true);
  }, []);

  // Derive active conversation
  const activeConv = activeId ? conversations.find((c) => c.id === activeId) ?? null : null;
  const messages = activeConv?.messages ?? [];

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, loading]);

  // Persist whenever conversations change (after initial load)
  useEffect(() => {
    if (mounted) {
      saveConversations(conversations);
    }
  }, [conversations, mounted]);

  const startNewConversation = useCallback(() => {
    setActiveId(null);
    setInput("");
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        saveConversations(next);
        return next;
      });
      if (activeId === id) {
        setActiveId(null);
      }
    },
    [activeId]
  );

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text.trim(),
    };

    let convId = activeId;
    let updatedConversations: Conversation[];

    if (!convId) {
      // Create new conversation
      convId = `c-${Date.now()}`;
      const newConv: Conversation = {
        id: convId,
        title: text.trim().slice(0, 20) + (text.trim().length > 20 ? "…" : ""),
        messages: [userMsg],
        createdAt: Date.now(),
      };
      updatedConversations = [newConv, ...conversations];
      setActiveId(convId);
    } else {
      // Append to existing conversation
      updatedConversations = conversations.map((c) =>
        c.id === convId ? { ...c, messages: [...c.messages, userMsg] } : c
      );
    }

    setConversations(updatedConversations);
    setInput("");
    setLoading(true);

    try {
      const convForApi = updatedConversations.find((c) => c.id === convId);
      const apiMessages = (convForApi?.messages ?? []).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/wenzhen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: data.content,
        liujing: data.liujing,
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, messages: [...c.messages, assistantMsg] } : c
        )
      );
    } catch {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    id: `e-${Date.now()}`,
                    role: "assistant" as const,
                    content: "抱歉，问诊服务暂时不可用，请稍后重试。",
                  },
                ],
              }
            : c
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // Avoid hydration mismatch — render nothing until localStorage is read
  if (!mounted) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1" />
          <MobileNav />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col max-h-screen">
          {/* Top bar: conversation title + new conversation */}
          <div className="flex items-center justify-between px-[var(--grid-outer)] py-2.5 lg:px-20 border-b border-[var(--border-copper)]">
            <span className="text-sm text-fg-secondary font-sans truncate max-w-[70%]">
              {activeConv ? activeConv.title : "新对话"}
            </span>
            <button
              onClick={startNewConversation}
              className="text-xs font-sans text-fg-muted hover:text-fg-primary transition-colors duration-[var(--transition-fast)]"
            >
              + 新对话
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-[var(--grid-outer)] py-12 lg:px-20">
            {/* Empty state: no active conversation */}
            {!activeConv && messages.length === 0 && (
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

                {/* 历史问诊 */}
                {conversations.length > 0 && (
                  <div className="mt-12">
                    <h3 className="font-sans text-sm text-fg-primary mb-4">历史问诊</h3>
                    <div>
                      {conversations.map((conv) => (
                        <div
                          key={conv.id}
                          className="flex items-center justify-between border-b border-[var(--border-copper)] py-3 group"
                        >
                          <button
                            onClick={() => setActiveId(conv.id)}
                            className="flex-1 text-left font-sans"
                          >
                            <span className="text-sm text-fg-secondary group-hover:text-fg-primary transition-colors duration-[var(--transition-fast)]">
                              {conv.title}
                            </span>
                            <span className="block text-xs text-fg-muted mt-0.5">
                              {formatDate(conv.createdAt)}
                            </span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(conv.id);
                            }}
                            className="text-xs text-fg-muted/40 hover:text-fg-muted px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--transition-fast)]"
                          >
                            删除
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Active conversation messages */}
            {messages.map((msg) => (
              <div key={msg.id} className="max-w-xl mx-auto mb-6">
                <div
                  className="border-l-2 pl-4 py-3"
                  style={{
                    borderLeftColor: msg.role === "user" ? "var(--fg-muted)" : "var(--accent-primary)",
                    backgroundColor: msg.role === "user" ? "var(--bg-surface)" : "transparent",
                  }}
                >
                  {msg.role === "user" ? (
                    <p className="text-sm text-fg-primary leading-relaxed whitespace-pre-wrap font-sans">
                      {msg.content}
                    </p>
                  ) : (
                    <Markdown content={msg.content} />
                  )}
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
