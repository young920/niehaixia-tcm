import Link from "next/link";

const NAV_ITEMS = [
  { href: "/wenzhen", label: "问诊" },
  { href: "/liujing", label: "六经" },
  { href: "/fangji", label: "方剂" },
  { href: "/bencao", label: "本草" },
  { href: "/yian", label: "医案" },
] as const;

/**
 * 铜版药典 MobileNav — 书签式底部导航
 * 花线分隔 + 衬线标签 + 铜色活跃标识
 */
export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-base border-t border-divider-rule">
      <div className="flex justify-around items-center h-14">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-0.5 text-fg-muted text-xs font-serif transition-[color] duration-[var(--transition-fast)] active:text-accent-primary active:decoration-copper active:underline active:underline-offset-4"
          >
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
