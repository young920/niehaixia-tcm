"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type LiujingKey = "taiyang" | "yangming" | "shaoyang" | "taiyin" | "shaoyin" | "jueyin";

interface FormulaGroup {
  name: string;
  key: LiujingKey;
  formulas: { name: string; desc: string }[];
}

/** 六经分类 · 经方全目录 */
const LIUJING_FORMULAS: FormulaGroup[] = [
  {
    name: "太阳经", key: "taiyang",
    formulas: [
      { name: "桂枝汤", desc: "中风表虚，调和营卫" },
      { name: "麻黄汤", desc: "伤寒表实，发汗解表" },
      { name: "葛根汤", desc: "太阳病，项背强" },
      { name: "大青龙汤", desc: "表实兼里热烦躁" },
      { name: "小青龙汤", desc: "外寒内饮，咳喘" },
      { name: "桂枝加葛根汤", desc: "太阳病项背强几几" },
      { name: "桂枝加厚朴杏子汤", desc: "中风兼喘" },
      { name: "桂枝加附子汤", desc: "表虚漏汗" },
      { name: "麻黄附子细辛汤", desc: "少阴兼太阳表证" },
      { name: "麻黄附子甘草汤", desc: "少阴兼表，微发汗" },
      { name: "桂枝麻黄各半汤", desc: "表郁轻证" },
      { name: "桂枝二麻黄一汤", desc: "表郁大汗出" },
      { name: "五苓散", desc: "蓄水证，化气利水" },
      { name: "桃核承气汤", desc: "蓄血证，逐瘀泄热" },
      { name: "抵当汤", desc: "蓄血重证" },
    ],
  },
  {
    name: "阳明经", key: "yangming",
    formulas: [
      { name: "白虎汤", desc: "阳明经热，清气分大热" },
      { name: "白虎加人参汤", desc: "阳明热盛伤津" },
      { name: "大承气汤", desc: "阳明腑实，峻下热结" },
      { name: "小承气汤", desc: "阳明腑实轻证" },
      { name: "调胃承气汤", desc: "阳明燥热内结" },
      { name: "麻子仁丸", desc: "脾约便秘" },
      { name: "栀子豉汤", desc: "虚烦不眠" },
      { name: "茵陈蒿汤", desc: "湿热发黄" },
      { name: "猪苓汤", desc: "阳明水热互结" },
    ],
  },
  {
    name: "少阳经", key: "shaoyang",
    formulas: [
      { name: "小柴胡汤", desc: "少阳半表半里，和解枢机" },
      { name: "大柴胡汤", desc: "少阳兼阳明里实" },
      { name: "柴胡加芒硝汤", desc: "少阳兼里实微结" },
      { name: "柴胡桂枝汤", desc: "太阳少阳并病" },
      { name: "柴胡桂枝干姜汤", desc: "少阳兼水饮内结" },
      { name: "柴胡加龙骨牡蛎汤", desc: "少阳兼烦惊谵语" },
      { name: "黄芩汤", desc: "少阳热利" },
      { name: "黄芩加半夏生姜汤", desc: "少阳热利兼呕" },
    ],
  },
  {
    name: "太阴经", key: "taiyin",
    formulas: [
      { name: "理中汤", desc: "太阴脾寒，温中散寒" },
      { name: "桂枝加芍药汤", desc: "太阴腹痛" },
      { name: "桂枝加大黄汤", desc: "太阴腹实痛" },
      { name: "小建中汤", desc: "中焦虚寒腹痛" },
      { name: "大建中汤", desc: "中阳衰虚寒痛" },
      { name: "甘草干姜汤", desc: "肺痿脾寒" },
      { name: "厚朴生姜半夏甘草人参汤", desc: "脾虚气滞腹胀" },
    ],
  },
  {
    name: "少阴经", key: "shaoyin",
    formulas: [
      { name: "四逆汤", desc: "少阴阳虚，回阳救逆" },
      { name: "四逆加人参汤", desc: "阳虚津伤" },
      { name: "通脉四逆汤", desc: "少阴格阳于外" },
      { name: "白通汤", desc: "少阴阴盛戴阳" },
      { name: "白通加猪胆汁汤", desc: "阴盛格阳反佐" },
      { name: "真武汤", desc: "少阴阳虚水泛" },
      { name: "附子汤", desc: "少阴阳虚身痛" },
      { name: "黄连阿胶汤", desc: "少阴热化心烦" },
      { name: "猪肤汤", desc: "少阴下利咽痛" },
      { name: "桃花汤", desc: "少阴下利脓血" },
      { name: "麻黄附子细辛汤", desc: "少阴兼表" },
    ],
  },
  {
    name: "厥阴经", key: "jueyin",
    formulas: [
      { name: "乌梅丸", desc: "厥阴寒热错杂，清上温下" },
      { name: "当归四逆汤", desc: "血虚寒厥" },
      { name: "当归四逆加吴茱萸生姜汤", desc: "血虚寒厥兼内有久寒" },
      { name: "吴茱萸汤", desc: "厥阴头痛干呕" },
      { name: "干姜黄芩黄连人参汤", desc: "寒热错杂之呕" },
      { name: "白头翁汤", desc: "厥阴热利" },
    ],
  },
];

/**
 * 一保堂式 经方 — 极简、轻盈
 */
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
          <div className="section-title pt-4 mb-6">
            <h1 className="font-sans text-lg text-fg-primary mb-1">经方速查</h1>
            <p className="engraving-label">FORMULARY</p>
          </div>

          {/* Search */}
          <div className="flex gap-3 mb-6 max-w-xl border-b border-[var(--border-copper)] pb-4">
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search(query)}
              placeholder="输入方名，如：桂枝汤…"
              className="flex-1 bg-transparent border-b border-[var(--border-copper-thick)] px-1 py-2.5 text-sm text-fg-primary font-sans placeholder:text-fg-muted/40 focus:outline-none focus:border-accent-primary transition-[border-color] duration-[var(--transition-fast)]"
              disabled={loading}
            />
            <button
              onClick={() => search(query)}
              disabled={loading || !query.trim()}
              className="text-sm font-sans text-fg-inverse bg-accent-primary rounded-[var(--card-radius)] px-5 py-2 tracking-wider transition-[opacity] duration-[var(--transition-fast)] hover:opacity-85 disabled:opacity-30 disabled:pointer-events-none"
            >
              查方
            </button>
          </div>

          {!result && !loading && (
            <section>
              <h2 className="section-title font-sans text-sm text-fg-primary mb-6">六经方剂目录</h2>
              <div className="space-y-8">
                {LIUJING_FORMULAS.map((group) => (
                  <div key={group.key}>
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: `var(--liujing-${group.key})` }}
                      />
                      <span className="font-sans text-sm" style={{ color: `var(--liujing-${group.key})` }}>
                        {group.name}
                      </span>
                    </div>
                    <div className="pl-4 border-l-2 space-y-0" style={{ borderLeftColor: `color-mix(in srgb, var(--liujing-${group.key}) 25%, transparent)` }}>
                      {group.formulas.map((f) => (
                        <button
                          key={f.name}
                          onClick={() => search(`${f.name}的组成、主治和临床应用`)}
                          className="block w-full text-left border-b border-[var(--border-copper)] py-2.5 px-0 font-sans transition-colors duration-[var(--transition-fast)] hover:bg-bg-surface"
                        >
                          <span className="text-sm text-fg-primary">{f.name}</span>
                          <span className="text-xs text-fg-muted ml-2">{f.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {loading && (
            <div className="py-8">
              <p className="text-sm text-fg-muted font-sans">正在检索经方…</p>
            </div>
          )}

          {result && !loading && (
            <div className="border-l-2 pl-5 py-6" style={{ borderLeftColor: "var(--accent-primary)" }}>
              <div className="text-fg-primary text-sm leading-relaxed whitespace-pre-wrap font-sans">{result}</div>
              <div className="mt-6 pt-4 border-t border-[var(--border-copper)]">
                <Button variant="ghost" onClick={() => { setResult(null); setQuery(""); }}>← 返回经方目录</Button>
              </div>
            </div>
          )}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
