"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";

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
    tag: "taiyang" as const,
    desc: "养命·无毒·久服",
    herbs: ["人参", "甘草", "茯苓", "白术", "桂枝", "麻黄", "当归", "地黄", "黄芪"],
  },
  {
    title: "中品",
    tag: "shaoyang" as const,
    desc: "养性·补虚·酌用",
    herbs: ["黄芩", "黄连", "半夏", "芍药", "厚朴", "枳实", "柴胡", "干姜", "细辛"],
  },
  {
    title: "下品",
    tag: "yangming" as const,
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
          <h1 className="font-serif text-2xl text-accent-ink mb-2">本草查询</h1>
          <p className="text-fg-muted text-sm mb-6">
            神农本草经 345 种，三品分类·五味归经·炮制要点
          </p>

          {/* Search */}
          <div className="flex gap-3 mb-6 max-w-xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search(query)}
              placeholder="输入药名，如：桂枝、附子、黄芩..."
              className="flex-1 bg-bg-card rounded-[var(--card-radius)] border border-fg-muted/20 px-4 py-2.5 text-sm text-fg-primary placeholder:text-fg-muted focus:outline-none focus:border-accent-primary/50"
              disabled={loading}
            />
            <Button variant="primary" onClick={() => search(query)} disabled={loading || !query.trim()}>
              查药
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

          {/* Three Grades */}
          {!result && !loading && (
            <section>
              <h2 className="font-serif text-base text-accent-ink mb-4">三品分类</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PIN_COLUMNS.map((col) => (
                  <Card key={col.title}>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag variant={col.tag}>{col.title}</Tag>
                      <span className="text-xs text-fg-muted">{col.desc}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {col.herbs.map((herb) => (
                        <button
                          key={herb}
                          onClick={() => search(`${herb}的性味、归经、主治和倪师临床用法`)}
                          className="text-xs text-fg-secondary bg-fg-muted/5 rounded-[var(--pill-radius)] px-2.5 py-1 transition-colors hover:bg-fg-muted/15 hover:text-fg-primary"
                        >
                          {herb}
                        </button>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Loading */}
          {loading && (
            <Card>
              <p className="text-sm text-fg-muted">正在检索本草...</p>
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
                  ← 返回本草目录
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
