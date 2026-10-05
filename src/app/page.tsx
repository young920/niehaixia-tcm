import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";

const FEATURES = [
  {
    href: "/wenzhen",
    title: "AI 问诊对话",
    desc: "以倪海厦经方思维引导问诊，六经辨证实时定位",
    tag: "核心",
    tagVariant: "taiyang" as const,
  },
  {
    href: "/liujing",
    title: "六经辨证可视化",
    desc: "太阳→阳明→少阳→太阴→少阴→厥阴 传变路径交互图",
    tag: "可视化",
    tagVariant: "shaoyang" as const,
  },
  {
    href: "/fangji",
    title: "经方速查",
    desc: "伤寒论129条 + 金匮23篇，组成·剂量·煎服法·禁忌",
    tag: "方剂",
    tagVariant: "yangming" as const,
  },
  {
    href: "/bencao",
    title: "本草查询",
    desc: "神农本草经345种，三品分类·五味归经·炮制要点",
    tag: "本草",
    tagVariant: "taiyin" as const,
  },
  {
    href: "/yian",
    title: "医案检索",
    desc: "849例倪师真实医案，按癌症/心血管/代谢病等6类检索",
    tag: "医案",
    tagVariant: "shaoyin" as const,
  },
];

const LIUJING = [
  { name: "太阳", key: "taiyang", desc: "表证·初起" },
  { name: "阳明", key: "yangming", desc: "里热·炽盛" },
  { name: "少阳", key: "shaoyang", desc: "半表半里" },
  { name: "太阴", key: "taiyin", desc: "脾寒·湿困" },
  { name: "少阴", key: "shaoyin", desc: "心肾阳虚" },
  { name: "厥阴", key: "jueyin", desc: "阴阳逆乱" },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 px-[var(--grid-outer)] py-12 lg:px-16 lg:py-16 max-w-[var(--main-grid-width-reading)]">
          {/* Hero */}
          <section className="mb-16">
            <h1 className="font-serif text-3xl lg:text-4xl text-accent-ink mb-4 leading-tight">
              倪海厦·经方中医问诊
            </h1>
            <p className="text-fg-secondary text-base lg:text-lg max-w-xl mb-2 leading-relaxed">
              基于 865KB 知识库 + 849 例医案 + 345 种本草 + 伤寒金匮全文蒸馏的 AI 问诊系统
            </p>
            <p className="font-serif text-accent-primary text-sm mt-6 italic tracking-wide">
              「中医很简单，就是阴阳气血。你搞懂了，一通百通。」
              <span className="text-fg-muted not-italic ml-2 text-xs">—— 倪海厦</span>
            </p>
          </section>

          {/* Feature Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 mb-16">
            {FEATURES.map((f) => (
              <Link key={f.href} href={f.href}>
                <Card hover className="h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag variant={f.tagVariant}>{f.tag}</Tag>
                    <h3 className="font-serif text-base text-accent-ink">{f.title}</h3>
                  </div>
                  <p className="text-fg-muted text-sm leading-relaxed">{f.desc}</p>
                </Card>
              </Link>
            ))}
          </section>

          {/* 六经速查 */}
          <section className="mb-16">
            <h2 className="font-serif text-lg text-accent-ink mb-6">六经辨证速查</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {LIUJING.map(({ name, key, desc }) => (
                <div
                  key={key}
                  className="rounded-[var(--card-radius)] p-4 text-center"
                  style={{
                    backgroundColor: `color-mix(in srgb, var(--liujing-${key}) 10%, transparent)`,
                  }}
                >
                  <p
                    className="font-serif text-lg mb-1"
                    style={{ color: `var(--liujing-${key})` }}
                  >
                    {name}
                  </p>
                  <p className="text-xs text-fg-muted">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-8">
            <Link href="/wenzhen">
              <Button variant="primary" className="text-base px-10 py-3">
                开始问诊
              </Button>
            </Link>
          </section>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
