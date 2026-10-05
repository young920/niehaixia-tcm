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
 * 一保堂式 Home — 大留白、内容说话
 */
export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 px-[var(--grid-outer)] py-16 lg:px-20 lg:py-24 max-w-[var(--main-grid-width-reading)]">

          {/* Hero — 极轻：小标题、大量留白 */}
          <section className="mb-20">
            <h1 className="font-sans text-2xl lg:text-3xl text-fg-primary leading-snug tracking-wide mb-4">
              倪海厦·经方中医问诊
            </h1>
            <p className="engraving-label mb-6">CLASSICAL CHINESE MEDICINE</p>
            <p className="text-fg-secondary text-sm max-w-lg mb-6 leading-relaxed">
              基于 865KB 知识库 + 849 例医案 + 345 种本草 + 伤寒金匮全文蒸馏
            </p>
            <p className="text-fg-muted text-sm italic mb-8">
              「中医很简单，就是阴阳气血。你搞懂了，一通百通。」
              <span className="not-italic ml-2 text-xs">—— 倪海厦</span>
            </p>
            {/* 水墨装饰 — 沉静不争 */}
            <div className="mb-8">
              <img
                src="/images/hero-ink-wash.png"
                alt="水墨山水"
                className="w-full max-w-md rounded-[var(--card-radius)] opacity-80"
                loading="lazy"
              />
            </div>
            <Link
              href="/wenzhen"
              className="text-sm text-accent-primary border-b border-accent-primary/30 pb-0.5 transition-[border-color] duration-[var(--transition-fast)] hover:border-accent-primary"
            >
              开始问诊 →
            </Link>
          </section>

          {/* 横幅装饰 — 铜版本草线绘 */}
          <div className="mb-16 overflow-hidden">
            <img
              src="/images/botanical-banner.png"
              alt="本草线绘"
              className="w-full h-12 object-cover opacity-60"
              loading="lazy"
            />
          </div>

          {/* Feature Grid — 干净卡片 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mb-20">
            {FEATURES.map((f) => (
              <Link key={f.href} href={f.href}>
                <Card hover className="h-full">
                  <div className="flex items-center gap-2.5 mb-2">
                    <Tag variant={f.tagVariant}>{f.tag}</Tag>
                    <h3 className="font-sans text-sm text-fg-primary">{f.title}</h3>
                  </div>
                  <p className="text-fg-muted text-xs leading-relaxed">{f.desc}</p>
                </Card>
              </Link>
            ))}
          </section>

          {/* 六经速查 — 极简色条 */}
          <section>
            <h2 className="section-title font-sans text-sm text-fg-primary mb-6">六经辨证速查</h2>
            <div className="border border-[var(--border-copper)] rounded-[var(--card-radius)] overflow-hidden">
              <div className="flex">
                {LIUJING.map(({ name, key, desc }, i) => (
                  <div
                    key={key}
                    className={`flex-1 py-4 px-3 text-center transition-colors duration-[var(--transition-fast)] hover:bg-surface ${
                      i < LIUJING.length - 1 ? "border-r border-[var(--divider-rule)]" : ""
                    }`}
                    style={{ borderBottom: `2px solid var(--liujing-${key})` }}
                  >
                    <p
                      className="font-sans text-sm mb-0.5"
                      style={{ color: `var(--liujing-${key})` }}
                    >
                      {name}
                    </p>
                    <p className="text-[0.65rem] text-fg-muted">{desc}</p>
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
