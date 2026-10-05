"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const QUICK_QUERIES = [
  { label: "桂枝", query: "桂枝的性味、归经、主治和倪师临床用法" },
  { label: "麻黄", query: "麻黄的性味、归经、主治和炮制要点" },
  { label: "附子", query: "附子的性味、主治、炮制和用量禁忌" },
  { label: "黄芩", query: "黄芩的性味、归经和临床应用" },
  { label: "人参", query: "人参的性味、主治和倪师用法" },
  { label: "半夏", query: "半夏的性味、主治和炮制要点" },
];

const PIN_COLUMNS = [
  {
    title: "上品",
    liujing: "taiyang",
    desc: "养命·无毒·久服",
    herbs: ["人参", "甘草", "茯苓", "白术", "桂枝", "麻黄", "当归", "地黄", "黄芪"],
  },
  {
    title: "中品",
    liujing: "shaoyang",
    desc: "养性·补虚·酌用",
    herbs: ["黄芩", "黄连", "半夏", "芍药", "厚朴", "枳实", "柴胡", "干姜", "细辛"],
  },
  {
    title: "下品",
    liujing: "yangming",
    desc: "治病·攻邪·慎用",
    herbs: ["大黄", "附子", "甘遂", "大戟", "芒硝", "巴豆", "乌头", "水蛭", "蜈蚣"],
  },
];

export default function BencaoPage() {
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
        body: JSON.stringify({ domain: "bencao", query: text.trim() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data.content);
    } catch {
      setResult("抱歉，本草查询服务暂时不可用，请稍后重试。");
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
            <h1 className="font-serif text-2xl text-accent-ink mb-2">本草查询</h1>
            <p className="engraving-label">MATERIA MEDICA · 神农本草经 345 种</p>
          </div>

          <div className="flex gap-3 mb-6 max-w-xl border-b-2 border-copper/20 pb-4">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search(query)} placeholder="输入药名，如：桂枝、附子…"
              className="flex-1 bg-transparent border-b-2 border-sepia px-1 py-2.5 text-sm text-fg-primary font-serif placeholder:text-fg-muted/50 focus:outline-none focus:border-copper transition-[border-color] duration-[var(--transition-fast)]"
              disabled={loading}
            />
            <button onClick={() => search(query)} disabled={loading || !query.trim()}
              className="text-sm font-serif text-copper px-5 py-2 border-2 border-copper tracking-wider transition-[background-color,color,border-color] duration-[var(--transition-fast)] hover:bg-copper hover:text-fg-inverse hover:border-copper disabled:opacity-40 disabled:pointer-events-none">
              查药
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {QUICK_QUERIES.map((q) => (
              <button key={q.label} onClick={() => search(q.query)}
                className="text-xs font-serif text-fg-secondary border border-sepia bg-vellum-warm px-3 py-1.5 transition-[color,border-color,background-color] duration-[var(--transition-fast)] hover:text-accent-primary hover:border-copper hover:bg-surface">
                {q.label}
              </button>
            ))}
          </div>

          {!result && !loading && (
            <section>
              <h2 className="section-title font-serif text-base text-accent-ink mb-4">三品分类</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {PIN_COLUMNS.map((col) => (
                  <div key={col.title} className="plate-frame p-6">
                    <div className="flex items-center gap-3 mb-4 border-b-2 border-copper/20 pb-3">
                      <span className="font-serif text-lg" style={{ color: `var(--liujing-${col.liujing})` }}>{col.title}</span>
                      <span className="engraving-label">{col.desc}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-2">
                      {col.herbs.map((herb) => (
                        <button key={herb} onClick={() => search(`${herb}的性味、归经、主治和倪师临床用法`)}
                          className="text-xs font-serif text-fg-secondary border-b border-sepia px-0.5 py-0.5 transition-[color,border-color] duration-[var(--transition-fast)] hover:text-accent-primary hover:border-copper">
                          {herb}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {loading && <div className="plate-frame p-8"><p className="text-sm text-fg-muted font-serif">正在检索本草…</p></div>}

          {result && !loading && (
            <div className="plate-frame p-8 copper-corners">
              <div className="text-fg-primary text-sm leading-relaxed whitespace-pre-wrap font-serif">{result}</div>
              <div className="mt-6 pt-4 border-t border-divider-rule">
                <Button variant="ghost" onClick={() => { setResult(null); setQuery(""); }}>← 返回本草目录</Button>
              </div>
            </div>
          )}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
