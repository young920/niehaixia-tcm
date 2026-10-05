import Link from "next/link";

const NAV_ITEMS = [
  { href: "/wenzhen", label: "AI问诊", icon: "💬" },
  { href: "/liujing", label: "六经辨证", icon: "◈" },
  { href: "/fangji", label: "方剂速查", icon: "▤" },
  { href: "/bencao", label: "本草查询", icon: "❋" },
  { href: "/yian", label: "医案检索", icon: "◧" },
] as const;

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[var(--side-nav-width)] min-h-screen border-r border-fg-muted/10 px-[var(--grid-outer)] py-8">
      <Link href="/" className="mb-10">
        <h1 className="font-serif text-xl text-accent-ink tracking-wide">
          倪海厦
        </h1>
        <p className="text-xs text-fg-muted mt-1 tracking-widest">经方中医问诊</p>
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-[var(--card-radius)] text-fg-secondary text-sm transition-[background-color] duration-[var(--transition-fast)] hover:bg-bg-card"
          >
            <span className="text-base w-6 text-center">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-fg-muted/10">
        <p className="text-xs text-fg-muted leading-relaxed">
          基于倪海厦（1954-2012）<br />
          经方体系 · 仅供学习研究
        </p>
      </div>
    </aside>
  );
}
