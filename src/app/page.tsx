import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";

const FEATURES = [
  {
    href: "/wenzhen",
    title: "问诊对话",
    desc: "以倪海厦经方思维引导问诊，六经辨证实时定位",
    tag: "核心",
    tagVariant: "taiyang" as const,
  },
  {
    href: "/liujing",
    title: "六经辨证",
    desc: "太阳→阳明→少阳→太阴→少阴→厥阴 传变路径",
    tag: "可视化",
    tagVariant: "shaoyang" as const,
  },
  {
    href: "/fangji",
    title: "经方速查",
    desc: "伤寒论129条 + 金匮23篇，组成·剂量·煎服法",
    tag: "方剂",
    tagVariant: "yangming" as const,
  },
  {
    href: "/bencao",
    title: "本草查询",
    desc: "神农本草经345种，三品分类·五味归经·炮制",
    tag: "本草",
    tagVariant: "taiyin" as const,
  },
  {
    href: "/yian",
    title: "医案检索",
    desc: "849例倪师真实医案，按癌症/心血管/代谢病检索",
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

/**
 * 铜版药典 Home — 书名页 + 目录
 * Hero = 扉页题签，Features = 药典目录，六经 = 铜版插图版
 */
export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 px-[var(--grid-outer)] py-12 lg:px-16 lg:py-16 max-w-[var(--main-grid-width-reading)]">
          {/* Hero — 扉页题签式 */}
          <section className="mb-16">
            <div className="section-title pt-4 mb-6">
              <h1 className="font-serif text-3xl lg:text-4xl text-accent-ink leading-tight">
                倪海厦·经方中医问诊
              </h1>
            </div>
            <p className="engraving-label mb-3">AI DIAGNOSTIC SYSTEM · CLASSICAL CHINESE MEDICINE</p>
            <p className="text-fg-secondary text-base lg:text-lg max-w-xl mb-2 leading-relaxed font-serif">
              基于 865KB 知识库 + 849 例医案 + 345 种本草 + 伤寒金匮全文蒸馏
            </p>
            <p className="font-serif text-accent-primary text-sm mt-6 italic tracking-wide">
              「中医很简单，就是阴阳气血。你搞懂了，一通百通。」
              <span className="text-fg-muted not-italic ml-2 text-xs">—— 倪海厦</span>
            </p>
            <Link
              href="/wenzhen"
              className="inline-block mt-6 text-sm font-serif text-accent-primary border-b border-copper/30 pb-0.5 transition-[border-color] duration-[var(--transition-fast)] hover:border-copper"
            >
              开始问诊 →
            </Link>
          </section>

          {/* Ornamental Divider */}
          <div className="ornamental-rule mb-16"><span>◆</span></div>

          {/* Feature Grid — 药典目录 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 mb-16">
            {FEATURES.map((f, i) => (
              <Link key={f.href} href={f.href}>
                <Card hover className="h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-serif text-xs text-copper mr-1">{String(i + 1).padStart(2, "0")}</span>
                    <Tag variant={f.tagVariant}>{f.tag}</Tag>
                    <h3 className="font-serif text-base text-accent-ink">{f.title}</h3>
                  </div>
                  <p className="text-fg-muted text-sm leading-relaxed">{f.desc}</p>
                </Card>
              </Link>
            ))}
          </section>

          {/* 六经速查 — 铜版插图板式 */}
          <section className="mb-16">
            <h2 className="section-title font-serif text-lg text-accent-ink mb-6">六经辨证速查</h2>
            <div className="plate-frame p-0">
              <div className="flex">
                {LIUJING.map(({ name, key, desc }, i) => (
                  <div
                    key={key}
                    className={`flex-1 p-4 text-center border-b-2 transition-[border-color] duration-[var(--transition-fast)] hover:bg-surface ${
                      i < LIUJING.length - 1 ? "border-r border-divider-rule" : ""
                    }`}
                    style={{ borderBottomColor: `var(--liujing-${key})` }}
                  >
                    <p
                      className="font-serif text-lg mb-1"
                      style={{ color: `var(--liujing-${key})` }}
                    >
                      {name}
                    </p>
                    <p className="text-xs text-fg-muted font-serif">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
