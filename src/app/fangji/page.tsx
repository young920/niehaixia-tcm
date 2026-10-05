"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const QUICK_QUERIES = [
  { label: "桂枝汤", query: "桂枝汤的组成、剂量、煎服法和主治" },
  { label: "麻黄汤", query: "麻黄汤的组成、主治和禁忌" },
  { label: "小柴胡汤", query: "小柴胡汤的组成、主治及少阳病应用" },
  { label: "四逆汤", query: "四逆汤的组成、主治和少阴病应用" },
  { label: "白虎汤", query: "白虎汤的组成、主治和阳明病应用" },
  { label: "真武汤", query: "真武汤的组成、主治和临床要点" },
];

const FEATURED_FORMULAS = [
  { name: "桂枝汤", liujing: "taiyang", desc: "中风表虚，调和营卫" },
  { name: "麻黄汤", liujing: "taiyang", desc: "伤寒表实，发汗解表" },
  { name: "白虎汤", liujing: "yangming", desc: "阳明经热，清气分大热" },
  { name: "大承气汤", liujing: "yangming", desc: "阳明腑实，峻下热结" },
  { name: "小柴胡汤", liujing: "shaoyang", desc: "少阳半表半里，和解枢机" },
  { name: "理中汤", liujing: "taiyin", desc: "太阴脾寒，温中散寒" },
  { name: "四逆汤", liujing: "shaoyin", desc: "少阴阳虚，回阳救逆" },
  { name: "乌梅丸", liujing: "jueyin", desc: "厥阴寒热错杂，清上温下" },
];

export default function FangjiPage() {
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
        body: JSON.stringify({ domain: "fangji", query: text.trim() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data.content);
    } catch {
      setResult("抱歉，经方查询服务暂时不可用，请稍后重试。");
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
          <div className="border-t border-brass pt-4 mb-6">
            <h1 className="font-serif text-2xl text-accent-ink mb-2">经方速查</h1>
            <p className="text-ink-light text-sm">
              伤寒论 129 条 + 金匮 23 篇
            </p>
          </div>

          {/* Search — 查方登记式 */}
          <div className="flex gap-3 mb-6 max-w-xl border-b border-divider-wood pb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search(query)}
              placeholder="输入方名，如：桂枝汤…"
              className="flex-1 bg-transparent border-b border-wood px-1 py-2 text-sm text-fg-primary font-serif placeholder:text-ink-light/50 focus:outline-none focus:border-accent-primary transition-[border-color] duration-[var(--transition-fast)]"
              disabled={loading}
            />
            <button
              onClick={() => search(query)}
              disabled={loading || !query.trim()}
              className="text-sm font-serif text-brass px-4 py-2 border border-wood transition-[background-color,color,border-color] duration-[var(--transition-fast)] hover:bg-accent-primary hover:text-fg-inverse hover:border-accent-primary disabled:opacity-40 disabled:pointer-events-none"
            >
              查方
            </button>
          </div>

          {/* Quick Queries — 药签条目 */}
          <div className="flex flex-wrap gap-2 mb-8">
            {QUICK_QUERIES.map((q) => (
              <button
                key={q.label}
                onClick={() => search(q.query)}
                className="text-xs font-serif text-fg-secondary border-b border-divider-wood px-1 py-1.5 transition-[color,border-color] duration-[var(--transition-fast)] hover:text-accent-primary hover:border-accent-primary/30"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Featured — 药柜抽屉格 */}
          {!result && !loading && (
            <section>
              <h2 className="section-title font-serif text-base text-accent-ink mb-4">常用经方</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FEATURED_FORMULAS.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => search(`${f.name}的组成、主治和临床应用`)}
                    className="text-left"
                  >
                    <Card hover variant="drawer" className="h-full">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: `var(--liujing-${f.liujing})` }}
                        />
                        <span className="font-serif text-sm text-accent-ink">{f.name}</span>
                      </div>
                      <p className="text-xs text-ink-light leading-relaxed">{f.desc}</p>
                    </Card>
                  </button>
                ))}
              </div>
            </section>
          )}

          {loading && (
            <div className="border border-divider-wood bg-bg-card p-6">
              <p className="text-sm text-ink-light font-serif">正在检索经方…</p>
            </div>
          )}

          {result && !loading && (
            <div className="border border-divider-wood bg-bg-card p-6">
              <div className="text-fg-primary text-sm leading-relaxed whitespace-pre-wrap font-serif">
                {result}
              </div>
              <div className="mt-4 pt-4 border-t border-divider-wood">
                <Button variant="ghost" onClick={() => { setResult(null); setQuery(""); }}>
                  ← 返回经方目录
                </Button>
              </div>
            </div>
          )}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
