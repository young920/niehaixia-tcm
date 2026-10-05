import Link from "next/link";

const NAV_ITEMS = [
  { href: "/wenzhen", label: "AI问诊" },
  { href: "/liujing", label: "六经辨证" },
  { href: "/fangji", label: "方剂" },
  { href: "/bencao", label: "本草" },
  { href: "/yian", label: "医案" },
] as const;

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-card-solid border-t border-fg-muted/10">
      <div className="flex justify-around items-center h-14">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-0.5 text-fg-muted text-xs transition-[color] duration-[var(--transition-fast)] active:text-accent-primary"
          >
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
