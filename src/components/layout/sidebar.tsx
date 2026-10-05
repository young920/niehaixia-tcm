import Link from "next/link";

const NAV_ITEMS = [
  { href: "/wenzhen", label: "问诊", chapter: "壹" },
  { href: "/liujing", label: "六经", chapter: "贰" },
  { href: "/fangji", label: "方剂", chapter: "叁" },
  { href: "/bencao", label: "本草", chapter: "肆" },
  { href: "/yian", label: "医案", chapter: "伍" },
] as const;

/**
 * 铜版药典 Sidebar — 书籍目录页
 * 每个条目如药典章节编号 + 标题
 * 底部为出版信息式的版权说明
 */
export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[var(--side-nav-width)] min-h-screen bg-bg-sidebar border-r border-divider-rule px-[var(--grid-outer)] py-8">
      <Link href="/" className="mb-10">
        <h1 className="font-serif text-xl text-accent-ink tracking-wide">
          倪海厦
        </h1>
        <p className="engraving-label mt-1">COPPERPLATE PHARMACOPOEIA</p>
      </Link>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-4 px-3 py-3 text-fg-secondary text-sm transition-[background-color,color] duration-[var(--transition-fast)] hover:bg-bg-card hover:text-accent-ink"
          >
            <span className="font-serif text-xs text-copper w-5 text-center tracking-widest group-hover:text-accent-primary transition-[color] duration-[var(--transition-fast)]">
              {item.chapter}
            </span>
            <span className="font-serif">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-divider-rule">
        <p className="text-xs text-fg-muted leading-relaxed font-serif">
          基于倪海厦（1954-2012）<br />
          经方体系 · 仅供学习研究
        </p>
      </div>
    </aside>
  );
}
