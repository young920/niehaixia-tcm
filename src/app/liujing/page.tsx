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
    key: "taiyang",
    name: "太阳",
    desc: "表证·初起",
    symptoms: ["恶寒发热", "头项强痛", "脉浮"],
    formula: "桂枝汤 / 麻黄汤",
    pulse: "浮脉",
    color: "var(--liujing-taiyang)",
    tagVariant: "taiyang",
  },
  {
    key: "yangming",
    name: "阳明",
    desc: "里热·炽盛",
    symptoms: ["身热汗出", "不恶寒反恶热", "口渴脉洪大"],
    formula: "白虎汤 / 承气汤",
    pulse: "洪大/沉实",
    color: "var(--liujing-yangming)",
    tagVariant: "yangming",
  },
  {
    key: "shaoyang",
    name: "少阳",
    desc: "半表半里",
    symptoms: ["口苦咽干目眩", "往来寒热", "胸胁苦满"],
    formula: "小柴胡汤",
    pulse: "弦脉",
    color: "var(--liujing-shaoyang)",
    tagVariant: "shaoyang",
  },
  {
    key: "taiyin",
    name: "太阴",
    desc: "脾寒·湿困",
    symptoms: ["腹满而吐", "食不下", "自利脉缓弱"],
    formula: "理中汤 / 桂枝加芍药汤",
    pulse: "缓弱",
    color: "var(--liujing-taiyin)",
    tagVariant: "taiyin",
  },
  {
    key: "shaoyin",
    name: "少阴",
    desc: "心肾阳虚",
    symptoms: ["但欲寐", "四肢厥冷", "下利清谷脉微细"],
    formula: "四逆汤 / 真武汤",
    pulse: "微细",
    color: "var(--liujing-shaoyin)",
    tagVariant: "shaoyin",
  },
  {
    key: "jueyin",
    name: "厥阴",
    desc: "阴阳逆乱",
    symptoms: ["消渴", "气上撞心", "心中疼热饥不欲食"],
    formula: "乌梅丸",
    pulse: "微/弦",
    color: "var(--liujing-jueyin)",
    tagVariant: "jueyin",
  },
];

const TRANSMISSION_PATHS = [
  { from: "太阳", to: "阳明", label: "化热入里" },
  { from: "太阳", to: "少阳", label: "半表半里" },
  { from: "少阳", to: "阳明", label: "化热入里" },
  { from: "少阳", to: "太阴", label: "入脾" },
  { from: "阳明", to: "太阴", label: "脾虚转寒" },
  { from: "太阴", to: "少阴", label: "阳气更衰" },
  { from: "少阴", to: "厥阴", label: "阴阳逆转" },
  { from: "太阳", to: "少阴", label: "直中少阴" },
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
          <h1 className="font-serif text-2xl text-accent-ink mb-2">六经辨证</h1>
          <p className="text-fg-muted text-sm mb-8">
            太阳→阳明→少阳→太阴→少阴→厥阴 传变路径交互图
          </p>

          {/* Transmission Flow */}
          <section className="mb-10">
            <h2 className="font-serif text-base text-accent-ink mb-4">传变路径</h2>
            <div className="relative">
              {/* Stage Nodes - horizontal flow */}
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 lg:gap-4">
                {STAGES.map((stage, i) => (
                  <div key={stage.key} className="flex items-center gap-2 md:gap-3 lg:gap-4">
                    {/* Arrow between stages */}
                    {i > 0 && (
                      <div className="hidden md:flex flex-col items-center text-fg-muted">
                        <svg width="24" height="12" viewBox="0 0 24 12" className="text-fg-muted/40">
                          <path d="M0 6 L18 6 M14 2 L18 6 L14 10" stroke="currentColor" fill="none" strokeWidth="1.5" />
                        </svg>
                      </div>
                    )}
                    {/* Stage node */}
                    <button
                      onClick={() => setActiveStage(activeStage === stage.key ? null : stage.key)}
                      className="relative group transition-all duration-[var(--transition-fast)]"
                    >
                      <div
                        className={`
                          rounded-[var(--card-radius)] px-5 py-4 text-center transition-all duration-[var(--transition-fast)]
                          ${activeStage === stage.key ? "shadow-[var(--shadow-thumbnail)] scale-105" : "shadow-[var(--shadow-card)]"}
                        `}
                        style={{
                          backgroundColor: activeStage === stage.key
                            ? `color-mix(in srgb, ${stage.color} 15%, transparent)`
                            : "var(--color-bg-card)",
                          border: activeStage === stage.key
                            ? `2px solid color-mix(in srgb, ${stage.color} 40%, transparent)`
                            : "2px solid transparent",
                        }}
                      >
                        <p
                          className="font-serif text-xl mb-1"
                          style={{ color: stage.color }}
                        >
                          {stage.name}
                        </p>
                        <p className="text-xs text-fg-muted">{stage.desc}</p>
                      </div>
                    </button>
                  </div>
                ))}
              </div>

              {/* Transmission paths legend */}
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {TRANSMISSION_PATHS.slice(0, 4).map((p) => (
                  <span key={`${p.from}-${p.to}`} className="text-xs text-fg-muted">
                    {p.from} → {p.to}（{p.label}）
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Selected Stage Detail */}
          {selected && (
            <section className="mb-10 animate-in fade-in duration-200">
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <Tag variant={selected.tagVariant}>{selected.name}经</Tag>
                  <span className="text-fg-secondary text-sm">{selected.desc}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Symptoms */}
                  <div>
                    <h3 className="font-serif text-sm text-accent-ink mb-2">主要症状</h3>
                    <ul className="space-y-1">
                      {selected.symptoms.map((s) => (
                        <li key={s} className="text-sm text-fg-secondary flex items-start gap-2">
                          <span style={{ color: selected.color }}>•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Formula */}
                  <div>
                    <h3 className="font-serif text-sm text-accent-ink mb-2">代表方剂</h3>
                    <p className="text-sm text-fg-secondary">{selected.formula}</p>
                    <Link
                      href={`/fangji?q=${encodeURIComponent(selected.formula.split(" / ")[0])}`}
                      className="text-xs text-accent-primary hover:underline mt-2 inline-block"
                    >
                      查看方剂详情 →
                    </Link>
                  </div>

                  {/* Pulse */}
                  <div>
                    <h3 className="font-serif text-sm text-accent-ink mb-2">脉象</h3>
                    <p className="text-sm text-fg-secondary">{selected.pulse}</p>
                  </div>
                </div>

                {/* Quick consultation link */}
                <div className="mt-4 pt-4 border-t border-fg-muted/10">
                  <Link
                    href={`/wenzhen`}
                    className="text-xs text-accent-primary hover:underline"
                  >
                    前往 AI 问诊 → 结合症状辨证
                  </Link>
                </div>
              </Card>
            </section>
          )}

          {/* All Stages Grid */}
          <section>
            <h2 className="font-serif text-base text-accent-ink mb-4">六经详览</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {STAGES.map((stage) => (
                <button
                  key={stage.key}
                  onClick={() => setActiveStage(stage.key)}
                  className="text-left"
                >
                  <Card hover className="h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag variant={stage.tagVariant}>{stage.name}经</Tag>
                      <span className="text-xs text-fg-muted">{stage.desc}</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-fg-muted mb-1">症状</p>
                        <p className="text-sm text-fg-secondary">{stage.symptoms.join("、")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-fg-muted mb-1">主方</p>
                        <p className="text-sm text-fg-secondary">{stage.formula}</p>
                      </div>
                      <div>
                        <p className="text-xs text-fg-muted mb-1">脉象</p>
                        <p className="text-sm text-fg-secondary">{stage.pulse}</p>
                      </div>
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          </section>

          {/* Diagnostic Flow */}
          <section className="mt-10">
            <h2 className="font-serif text-base text-accent-ink mb-4">七步辨证思维</h2>
            <Card>
              <ol className="space-y-3">
                {[
                  { step: 1, title: "辨六经", desc: "定病位——太阳/阳明/少阳/太阴/少阴/厥阴" },
                  { step: 2, title: "辨寒热", desc: "定病性——寒证/热证/寒热错杂" },
                  { step: 3, title: "辨虚实", desc: "定邪正——邪气盛为实，正气虚为虚" },
                  { step: 4, title: "合病并病", desc: "多经同病——合病（同时）并病（传变）" },
                  { step: 5, title: "真假鉴别", desc: "真寒假热——四肢温度、口渴真假、面色" },
                  { step: 6, title: "选方用药", desc: "遵经方——首选伤寒金匮原方" },
                  { step: 7, title: "预后判断", desc: "看阳气——阳气存则生，阳气亡则死" },
                ].map((item) => (
                  <li key={item.step} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-fg-inverse"
                      style={{ backgroundColor: "var(--color-accent-primary)" }}
                    >
                      {item.step}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-fg-primary">{item.title}</p>
                      <p className="text-xs text-fg-muted">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </section>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
