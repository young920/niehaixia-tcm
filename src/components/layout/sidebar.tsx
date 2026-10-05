import Link from "next/link";

const NAV_ITEMS = [
  { href: "/wenzhen", label: "问诊", icon: "问" },
  { href: "/liujing", label: "六经", icon: "经" },
  { href: "/fangji", label: "方剂", icon: "方" },
  { href: "/bencao", label: "本草", icon: "草" },
  { href: "/yian", label: "医案", icon: "案" },
] as const;

/**
 * 药柜目录 — 左侧导航
 * 每个条目如药柜抽屉签条：左侧铜色竖线 + 衬线标签
 */
export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[var(--side-nav-width)] min-h-screen bg-bg-sidebar border-r border-divider-wood px-[var(--grid-outer)] py-8">
      <Link href="/" className="mb-10">
        <h1 className="font-serif text-xl text-accent-ink tracking-wide">
          倪海厦
        </h1>
        <p className="text-xs text-ink-light mt-1 tracking-[0.2em]">经方中医问诊</p>
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-3 px-4 py-3 rounded-none text-fg-secondary text-sm transition-[background-color,color] duration-[var(--transition-fast)] hover:bg-bg-card hover:text-accent-ink"
          >
            <span className="w-5 h-5 flex items-center justify-center text-xs font-serif text-brass border-l-2 border-brass pl-1.5 group-hover:border-accent-primary group-hover:text-accent-primary transition-[border-color,color] duration-[var(--transition-fast)]">
              {item.icon}
            </span>
            <span className="font-serif">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-divider-wood">
        <p className="text-xs text-ink-light leading-relaxed font-serif">
          基于倪海厦（1954-2012）<br />
          经方体系 · 仅供学习研究
        </p>
      </div>
    </aside>
  );
}
