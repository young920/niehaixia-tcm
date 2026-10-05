"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import Link from "next/link";

interface LiujingStage {
  key: string;
  name: string;
  desc: string;
  symptoms: string[];
  formula: string;
  pulse: string;
  color: string;
  tagVariant: "taiyang" | "yangming" | "shaoyang" | "taiyin" | "shaoyin" | "jueyin";
}

const STAGES: LiujingStage[] = [
  {
    key: "taiyang", name: "太阳", desc: "表证·初起",
    symptoms: ["恶寒发热", "头项强痛", "脉浮"],
    formula: "桂枝汤 / 麻黄汤", pulse: "浮脉", color: "var(--liujing-taiyang)", tagVariant: "taiyang",
  },
  {
    key: "yangming", name: "阳明", desc: "里热·炽盛",
    symptoms: ["身热汗出", "不恶寒反恶热", "口渴脉洪大"],
    formula: "白虎汤 / 承气汤", pulse: "洪大/沉实", color: "var(--liujing-yangming)", tagVariant: "yangming",
  },
  {
    key: "shaoyang", name: "少阳", desc: "半表半里",
    symptoms: ["口苦咽干目眩", "往来寒热", "胸胁苦满"],
    formula: "小柴胡汤", pulse: "弦脉", color: "var(--liujing-shaoyang)", tagVariant: "shaoyang",
  },
  {
    key: "taiyin", name: "太阴", desc: "脾寒·湿困",
    symptoms: ["腹满而吐", "食不下", "自利脉缓弱"],
    formula: "理中汤 / 桂枝加芍药汤", pulse: "缓弱", color: "var(--liujing-taiyin)", tagVariant: "taiyin",
  },
  {
    key: "shaoyin", name: "少阴", desc: "心肾阳虚",
    symptoms: ["但欲寐", "四肢厥冷", "下利清谷脉微细"],
    formula: "四逆汤 / 真武汤", pulse: "微细", color: "var(--liujing-shaoyin)", tagVariant: "shaoyin",
  },
  {
    key: "jueyin", name: "厥阴", desc: "阴阳逆乱",
    symptoms: ["消渴", "气上撞心", "心中疼热饥不欲食"],
    formula: "乌梅丸", pulse: "微/弦", color: "var(--liujing-jueyin)", tagVariant: "jueyin",
  },
];

const STEPS = [
  { step: 1, title: "辨六经", desc: "定病位——太阳/阳明/少阳/太阴/少阴/厥阴" },
  { step: 2, title: "辨寒热", desc: "定病性——寒证/热证/寒热错杂" },
  { step: 3, title: "辨虚实", desc: "定邪正——邪气盛为实，正气虚为虚" },
  { step: 4, title: "合病并病", desc: "多经同病——合病（同时）并病（传变）" },
  { step: 5, title: "真假鉴别", desc: "真寒假热——四肢温度、口渴真假、面色" },
  { step: 6, title: "选方用药", desc: "遵经方——首选伤寒金匮原方" },
  { step: 7, title: "预后判断", desc: "看阳气——阳气存则生，阳气亡则死" },
];

export default function LiujingPage() {
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const selected = STAGES.find((s) => s.key === activeStage);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 px-[var(--grid-outer)] py-8 lg:px-16 lg:py-12 max-w-[var(--main-grid-width-reading)]">
          <div className="section-title pt-4 mb-8">
            <h1 className="font-serif text-2xl text-accent-ink mb-2">六经辨证</h1>
            <p className="engraving-label">SIX-CHANNEL DIFFERENTIATION · 六经传变</p>
          </div>

          {/* 传变路径 — 铜版经络图 */}
          <section className="mb-10">
            <h2 className="section-title font-serif text-base text-accent-ink mb-6">传变路径</h2>
            <div className="relative pl-10">
              {/* Central spine line */}
              <div className="absolute left-4 top-0 bottom-0 w-[3px]" style={{ background: "linear-gradient(to bottom, var(--color-copper), var(--border-copper), var(--color-copper))" }} />
              {STAGES.map((stage) => (
                <div key={stage.key} className="relative mb-5 last:mb-0">
                  {/* Diamond node */}
                  <div
                    className="absolute -left-7 top-3.5 w-4 h-4 rotate-45 border-2 transition-all duration-[var(--transition-fast)]"
                    style={{
                      borderColor: stage.color,
                      backgroundColor: activeStage === stage.key ? stage.color : "var(--bg-base)",
                      boxShadow: activeStage === stage.key ? `0 0 6px ${stage.color}` : "none",
                    }}
                  />
                  <button
                    onClick={() => setActiveStage(activeStage === stage.key ? null : stage.key)}
                    className="w-full text-left"
                  >
                    <div
                      className="border-b border-divider-rule py-3 px-3 transition-all duration-[var(--transition-fast)]"
                      style={{
                        borderLeft: activeStage === stage.key ? `4px solid ${stage.color}` : "4px solid transparent",
                        backgroundColor: activeStage === stage.key ? "var(--bg-surface)" : "transparent",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-xl" style={{ color: stage.color }}>{stage.name}</span>
                        <span className="text-xs text-fg-muted font-serif">{stage.desc}</span>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Selected stage detail — plate-frame with copper corners */}
          {selected && (
            <section className="mb-10 plate-frame p-8 copper-corners">
              <div className="flex items-center gap-3 mb-5 border-b-2 border-copper/20 pb-4">
                <Tag variant={selected.tagVariant}>{selected.name}经</Tag>
                <span className="text-fg-secondary text-sm font-serif">{selected.desc}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="engraving-label mb-3">SYMPTOMS · 主要症状</h3>
                  <ul className="space-y-2">
                    {selected.symptoms.map((s) => (
                      <li key={s} className="text-sm text-fg-secondary font-serif flex items-start gap-2">
                        <span style={{ color: selected.color }}>●</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="engraving-label mb-3">FORMULA · 代表方剂</h3>
                  <p className="text-sm text-fg-secondary font-serif">{selected.formula}</p>
                  <Link href={`/fangji?q=${encodeURIComponent(selected.formula.split(" / ")[0])}`} className="text-xs text-accent-primary hover:underline mt-3 inline-block font-serif">查看方剂 →</Link>
                </div>
                <div>
                  <h3 className="engraving-label mb-3">PULSE · 脉象</h3>
                  <p className="text-sm text-fg-secondary font-serif">{selected.pulse}</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-divider-rule">
                <Link href="/wenzhen" className="text-xs text-accent-primary hover:underline font-serif">前往问诊 →</Link>
              </div>
            </section>
          )}

          <div className="ornamental-rule my-12"><span>◆</span></div>

          {/* 七步辨证 — 编号段落 */}
          <section className="mt-12">
            <h2 className="section-title font-serif text-base text-accent-ink mb-6">七步辨证思维</h2>
            <div className="plate-frame p-8">
              <ol className="space-y-5">
                {STEPS.map((item) => (
                  <li key={item.step} className="flex items-start gap-5 border-b border-divider-rule pb-4 last:border-b-0 last:pb-0">
                    <span className="font-mono text-base text-copper font-semibold mt-0.5">{item.step}.</span>
                    <div>
                      <p className="text-sm font-serif text-fg-primary">{item.title}</p>
                      <p className="text-xs text-fg-muted mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
