"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PinGroup {
  title: string;
  liujing: string;
  desc: string;
  herbs: { name: string; nature: string }[];
}

/** 三品分类 · 本草全目录 */
const PIN_GROUPS: PinGroup[] = [
  {
    title: "上品",
    liujing: "taiyang",
    desc: "养命·无毒·久服",
    herbs: [
      { name: "人参", nature: "甘微寒" }, { name: "甘草", nature: "甘平" },
      { name: "茯苓", nature: "甘淡平" }, { name: "白术", nature: "苦甘温" },
      { name: "桂枝", nature: "辛甘温" }, { name: "麻黄", nature: "辛苦温" },
      { name: "当归", nature: "甘辛温" }, { name: "地黄", nature: "甘寒" },
      { name: "黄芪", nature: "甘微温" }, { name: "山药", nature: "甘平" },
      { name: "薏苡仁", nature: "甘淡微寒" }, { name: "麦冬", nature: "甘微寒" },
      { name: "天冬", nature: "甘苦寒" }, { name: "五味子", nature: "酸温" },
      { name: "菟丝子", nature: "辛甘平" }, { name: "枸杞", nature: "甘平" },
      { name: "杜仲", nature: "甘温" }, { name: "牛膝", nature: "苦酸平" },
      { name: "柏子仁", nature: "甘平" }, { name: "酸枣仁", nature: "酸平" },
    ],
  },
  {
    title: "中品",
    liujing: "shaoyang",
    desc: "养性·补虚·酌用",
    herbs: [
      { name: "黄芩", nature: "苦寒" }, { name: "黄连", nature: "苦寒" },
      { name: "半夏", nature: "辛温" }, { name: "芍药", nature: "苦酸微寒" },
      { name: "厚朴", nature: "苦辛温" }, { name: "枳实", nature: "苦辛微寒" },
      { name: "柴胡", nature: "苦辛微寒" }, { name: "干姜", nature: "辛热" },
      { name: "细辛", nature: "辛温" }, { name: "知母", nature: "苦寒" },
      { name: "石膏", nature: "辛甘大寒" }, { name: "栀子", nature: "苦寒" },
      { name: "泽泻", nature: "甘淡寒" }, { name: "猪苓", nature: "甘淡平" },
      { name: "防己", nature: "苦辛寒" }, { name: "秦艽", nature: "苦辛平" },
      { name: "紫菀", nature: "苦辛温" }, { name: "款冬花", nature: "辛温" },
    ],
  },
  {
    title: "下品",
    liujing: "yangming",
    desc: "治病·攻邪·慎用",
    herbs: [
      { name: "大黄", nature: "苦寒" }, { name: "附子", nature: "辛甘大热" },
      { name: "甘遂", nature: "苦寒有毒" }, { name: "大戟", nature: "苦寒有毒" },
      { name: "芒硝", nature: "咸寒" }, { name: "巴豆", nature: "辛热大毒" },
      { name: "乌头", nature: "辛热大毒" }, { name: "水蛭", nature: "咸苦平有毒" },
      { name: "蜈蚣", nature: "辛温有毒" }, { name: "芫花", nature: "辛苦温有毒" },
      { name: "商陆", nature: "苦寒有毒" }, { name: "牵牛子", nature: "苦寒有毒" },
      { name: "葶苈子", nature: "辛苦大寒" }, { name: "射干", nature: "苦寒" },
    ],
  },
];

/**
 * 一保堂式 本草 — 极简、轻盈
 */
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
            <h1 className="font-sans text-lg text-fg-primary mb-1">本草查询</h1>
            <p className="engraving-label">MATERIA MEDICA</p>
          </div>

          {/* Search */}
          <div className="flex gap-3 mb-6 max-w-xl border-b border-[var(--border-copper)] pb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search(query)}
              placeholder="输入药名，如：桂枝、附子…"
              className="flex-1 bg-transparent border-b border-[var(--border-copper-thick)] px-1 py-2.5 text-sm text-fg-primary font-sans placeholder:text-fg-muted/40 focus:outline-none focus:border-accent-primary transition-[border-color] duration-[var(--transition-fast)]"
              disabled={loading}
            />
            <button
              onClick={() => search(query)}
              disabled={loading || !query.trim()}
              className="text-sm font-sans text-fg-inverse bg-accent-primary rounded-[var(--card-radius)] px-5 py-2 tracking-wider transition-[opacity] duration-[var(--transition-fast)] hover:opacity-85 disabled:opacity-30 disabled:pointer-events-none"
            >
              查药
            </button>
          </div>

          {!result && !loading && (
            <section>
              <h2 className="section-title font-sans text-sm text-fg-primary mb-6">三品分类</h2>
              <div className="space-y-8">
                {PIN_GROUPS.map((group) => (
                  <div key={group.title}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-sans text-sm" style={{ color: `var(--liujing-${group.liujing})` }}>
                        {group.title}
                      </span>
                      <span className="text-xs text-fg-muted font-sans">{group.desc}</span>
                    </div>
                    <div
                      className="pl-4 border-l-2"
                      style={{ borderLeftColor: `color-mix(in srgb, var(--liujing-${group.liujing}) 25%, transparent)` }}
                    >
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-0">
                        {group.herbs.map((herb) => (
                          <button
                            key={herb.name}
                            onClick={() => search(`${herb.name}的性味、归经、主治和倪师临床用法`)}
                            className="flex items-center justify-between border-b border-[var(--border-copper)] py-2 px-0 font-sans transition-colors duration-[var(--transition-fast)] hover:bg-bg-surface"
                          >
                            <span className="text-sm text-fg-primary">{herb.name}</span>
                            <span className="text-xs text-fg-muted">{herb.nature}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {loading && (
            <div className="py-8">
              <p className="text-sm text-fg-muted font-sans">正在检索本草…</p>
            </div>
          )}

          {result && !loading && (
            <div className="border-l-2 pl-5 py-6" style={{ borderLeftColor: "var(--accent-primary)" }}>
              <div className="text-fg-primary text-sm leading-relaxed whitespace-pre-wrap font-sans">{result}</div>
              <div className="mt-6 pt-4 border-t border-[var(--border-copper)]">
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
