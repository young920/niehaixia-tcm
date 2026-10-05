"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";

const CATEGORIES = [
  { label: "癌症", query: "癌症相关医案", tag: "jueyin" as const },
  { label: "心血管", query: "心血管疾病医案", tag: "shaoyin" as const },
  { label: "代谢病", query: "代谢病（糖尿病/肥胖）医案", tag: "taiyin" as const },
  { label: "消化系统", query: "消化系统疾病医案", tag: "yangming" as const },
  { label: "呼吸系统", query: "呼吸系统疾病医案", tag: "taiyang" as const },
  { label: "妇科", query: "妇科疾病医案", tag: "shaoyang" as const },
];

const QUICK_QUERIES = [
  { label: "乳癌", query: "乳癌医案：倪海厦如何辨证论治乳癌" },
  { label: "失眠", query: "失眠医案：六经辨证治疗失眠的案例" },
  { label: "糖尿病", query: "糖尿病医案：倪海厦治疗糖尿病的经方思路" },
  { label: "感冒发烧", query: "感冒发烧医案：六经辨证治疗外感的案例" },
];

export default function YianPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async (text: string) => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setQuery(text);

    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: "yian", query: text.trim() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data.content);
    } catch {
      setResult("抱歉，医案检索服务暂时不可用，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 px-[var(--grid-outer)] py-8 lg:px-16 lg:py-12 max-w-[var(--main-grid-width-reading)]">
          <h1 className="font-serif text-2xl text-accent-ink mb-2">医案检索</h1>
          <p className="text-fg-muted text-sm mb-6">
            849 例倪师真实医案，按疾病分类检索
          </p>

          {/* Search */}
          <div className="flex gap-3 mb-6 max-w-xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search(query)}
              placeholder="输入疾病或症状，如：乳癌、失眠、糖尿病..."
              className="flex-1 bg-bg-card rounded-[var(--card-radius)] border border-fg-muted/20 px-4 py-2.5 text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:border-accent-primary/50"
              disabled={loading}
            />
            <Button variant="primary" onClick={() => search(query)} disabled={loading || !query.trim()}>
              检索
            </Button>
          </div>

          {/* Quick Queries */}
          <div className="flex flex-wrap gap-2 mb-8">
            {QUICK_QUERIES.map((q) => (
              <button
                key={q.label}
                onClick={() => search(q.query)}
                className="text-xs text-fg-secondary bg-bg-card rounded-[var(--pill-radius)] px-3 py-1.5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-thumbnail)]"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Category Grid */}
          {!result && !loading && (
            <section>
              <h2 className="font-serif text-base text-accent-ink mb-4">按疾病分类</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => search(cat.query)}
                    className="text-left"
                  >
                    <Card hover className="h-full">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag variant={cat.tag}>{cat.label}</Tag>
                      </div>
                      <p className="text-xs text-fg-muted">{cat.query}</p>
                    </Card>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Loading */}
          {loading && (
            <Card>
              <p className="text-sm text-fg-muted">正在检索医案...</p>
            </Card>
          )}

          {/* Result */}
          {result && !loading && (
            <Card>
              <div className="prose prose-sm max-w-none text-fg-primary leading-relaxed whitespace-pre-wrap">
                {result}
              </div>
              <div className="mt-4 pt-4 border-t border-fg-muted/10">
                <Button variant="ghost" onClick={() => { setResult(null); setQuery(""); }}>
                  ← 返回医案分类
                </Button>
              </div>
            </Card>
          )}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
