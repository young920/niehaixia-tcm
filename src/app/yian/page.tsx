"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type LiujingKey = "taiyang" | "yangming" | "shaoyang" | "taiyin" | "shaoyin" | "jueyin";

interface CaseGroup {
  name: string;
  liujing: LiujingKey;
  desc: string;
  items: string[];
}

/** 疾病分类 · 医案全目录 */
const CASE_GROUPS: CaseGroup[] = [
  {
    name: "癌症", liujing: "jueyin", desc: "乳癌·肝癌·肺癌·大肠癌等",
    items: ["乳癌", "肝癌", "肺癌", "大肠癌", "胃癌", "胰脏癌", "摄护腺癌", "血癌", "淋巴癌", "脑瘤"],
  },
  {
    name: "心血管", liujing: "shaoyin", desc: "心悸·胸痹·高血压等",
    items: ["心悸", "胸痹心痛", "高血压", "心律不齐", "心脏瓣膜病", "动脉硬化"],
  },
  {
    name: "代谢病", liujing: "taiyin", desc: "糖尿病·肥胖·痛风等",
    items: ["糖尿病", "肥胖", "痛风", "高血脂", "甲状腺疾病", "水肿"],
  },
  {
    name: "消化系统", liujing: "yangming", desc: "胃痛·便秘·腹泻·黄疸等",
    items: ["胃痛", "便秘", "腹泻", "黄疸", "胆结石", "肠梗阻", "痔疮", "胃溃疡"],
  },
  {
    name: "呼吸系统", liujing: "taiyang", desc: "感冒·咳嗽·哮喘·肺痿等",
    items: ["感冒发烧", "咳嗽", "哮喘", "肺痿", "肺痈", "鼻窦炎", "过敏"],
  },
  {
    name: "妇科", liujing: "shaoyang", desc: "月经·不孕·更年期等",
    items: ["月经不调", "痛经", "不孕", "更年期综合征", "子宫肌瘤", "带下"],
  },
  {
    name: "精神神志", liujing: "shaoyin", desc: "失眠·抑郁·癫痫等",
    items: ["失眠", "抑郁", "焦虑", "癫痫", "脏躁"],
  },
  {
    name: "风湿骨病", liujing: "taiyang", desc: "历节·痹证·腰痛等",
    items: ["风湿关节炎", "历节病", "腰痛", "颈椎病", "痛风性关节炎"],
  },
  {
    name: "泌尿系统", liujing: "shaoyin", desc: "水肿·淋证·肾结石等",
    items: ["水肿", "淋证", "肾结石", "尿频", "遗尿"],
  },
  {
    name: "皮肤科", liujing: "yangming", desc: "湿疹·荨麻疹·痈疽等",
    items: ["湿疹", "荨麻疹", "痈疽", "疔疮", "带状疱疹"],
  },
];

/**
 * 一保堂式 医案 — 极简、轻盈
 */
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
            <h1 className="font-sans text-lg text-fg-primary mb-1">医案检索</h1>
            <p className="engraving-label">CASE RECORDS</p>
          </div>

          {/* Search */}
          <div className="flex gap-3 mb-6 max-w-xl border-b border-[var(--border-copper)] pb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search(query)}
              placeholder="输入疾病或症状，如：乳癌、失眠…"
              className="flex-1 bg-transparent border-b border-[var(--border-copper-thick)] px-1 py-2.5 text-sm text-fg-primary font-sans placeholder:text-fg-muted/40 focus:outline-none focus:border-accent-primary transition-[border-color] duration-[var(--transition-fast)]"
              disabled={loading}
            />
            <button
              onClick={() => search(query)}
              disabled={loading || !query.trim()}
              className="text-sm font-sans text-fg-inverse bg-accent-primary rounded-[var(--card-radius)] px-5 py-2 tracking-wider transition-[opacity] duration-[var(--transition-fast)] hover:opacity-85 disabled:opacity-30 disabled:pointer-events-none"
            >
              检索
            </button>
          </div>

          {!result && !loading && (
            <section>
              <h2 className="section-title font-sans text-sm text-fg-primary mb-6">疾病分类目录</h2>
              <div className="space-y-8">
                {CASE_GROUPS.map((group) => (
                  <div key={group.name}>
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: `var(--liujing-${group.liujing})` }}
                      />
                      <span className="font-sans text-sm" style={{ color: `var(--liujing-${group.liujing})` }}>
                        {group.name}
                      </span>
                      <span className="text-xs text-fg-muted font-sans">{group.desc}</span>
                    </div>
                    <div
                      className="pl-4 border-l-2"
                      style={{ borderLeftColor: `color-mix(in srgb, var(--liujing-${group.liujing}) 25%, transparent)` }}
                    >
                      <div className="flex flex-wrap gap-x-2 gap-y-0">
                        {group.items.map((item) => (
                          <button
                            key={item}
                            onClick={() => search(`${item}医案：倪海厦如何辨证论治${item}`)}
                            className="text-sm text-fg-secondary border-b border-[var(--border-copper)] py-2 px-1 font-sans transition-colors duration-[var(--transition-fast)] hover:text-fg-primary"
                          >
                            {item}
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
              <p className="text-sm text-fg-muted font-sans">正在检索医案…</p>
            </div>
          )}

          {result && !loading && (
            <div className="border-l-2 pl-5 py-6" style={{ borderLeftColor: "var(--accent-primary)" }}>
              <div className="text-fg-primary text-sm leading-relaxed whitespace-pre-wrap font-sans">{result}</div>
              <div className="mt-6 pt-4 border-t border-[var(--border-copper)]">
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
