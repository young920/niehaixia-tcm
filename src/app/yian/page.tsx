"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { label: "癌症", query: "癌症相关医案", liujing: "jueyin" as const },
  { label: "心血管", query: "心血管疾病医案", liujing: "shaoyin" as const },
  { label: "代谢病", query: "代谢病（糖尿病/肥胖）医案", liujing: "taiyin" as const },
  { label: "消化系统", query: "消化系统疾病医案", liujing: "yangming" as const },
  { label: "呼吸系统", query: "呼吸系统疾病医案", liujing: "taiyang" as const },
  { label: "妇科", query: "妇科疾病医案", liujing: "shaoyang" as const },
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
          <div className="section-title pt-4 mb-6">
            <h1 className="font-serif text-2xl text-accent-ink mb-2">医案检索</h1>
            <p className="engraving-label">CASE RECORDS · 849 例倪师真实医案</p>
          </div>

          <div className="flex gap-3 mb-6 max-w-xl border-b border-divider-rule pb-4">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search(query)} placeholder="输入疾病或症状，如：乳癌、失眠…"
              className="flex-1 bg-transparent border-b border-sepia px-1 py-2 text-sm text-fg-primary font-serif placeholder:text-fg-muted/50 focus:outline-none focus:border-copper transition-[border-color] duration-[var(--transition-fast)]"
              disabled={loading}
            />
            <button onClick={() => search(query)} disabled={loading || !query.trim()}
              className="text-sm font-serif text-copper px-4 py-2 border border-copper tracking-wider transition-[background-color,color,border-color] duration-[var(--transition-fast)] hover:bg-copper hover:text-fg-inverse hover:border-copper disabled:opacity-40 disabled:pointer-events-none">
              检索
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {QUICK_QUERIES.map((q) => (
              <button key={q.label} onClick={() => search(q.query)}
                className="text-xs font-serif text-fg-secondary border border-sepia bg-vellum-warm px-3 py-1 transition-[color,border-color,background-color] duration-[var(--transition-fast)] hover:text-accent-primary hover:border-copper hover:bg-surface">
                {q.label}
              </button>
            ))}
          </div>

          {!result && !loading && (
            <section>
              <h2 className="section-title font-serif text-base text-accent-ink mb-4">按疾病分类</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => (
                  <button key={cat.label} onClick={() => search(cat.query)} className="text-left">
                    <Card hover className="h-full">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block w-2 h-2 rotate-45" style={{ backgroundColor: `var(--liujing-${cat.liujing})` }} />
                        <span className="font-serif text-sm text-accent-ink">{cat.label}</span>
                      </div>
                      <p className="text-xs text-fg-muted">{cat.query}</p>
                    </Card>
                  </button>
                ))}
              </div>
            </section>
          )}

          {loading && <div className="plate-frame p-6"><p className="text-sm text-fg-muted font-serif">正在检索医案…</p></div>}

          {result && !loading && (
            <div className="plate-frame p-6">
              <div className="text-fg-primary text-sm leading-relaxed whitespace-pre-wrap font-serif">{result}</div>
              <div className="mt-4 pt-4 border-t border-divider-rule">
                <Button variant="ghost" onClick={() => { setResult(null); setQuery(""); }}>← 返回医案分类</Button>
              </div>
            </div>
          )}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
