"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/wenzhen", label: "问诊" },
  { href: "/liujing", label: "六经" },
  { href: "/fangji", label: "方剂" },
  { href: "/bencao", label: "本草" },
  { href: "/yian", label: "医案" },
] as const;

/**
 * 一保堂式 MobileNav — 白底、轻盈文字
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-base border-t border-[var(--border-copper)]">
      <div className="flex justify-around items-center h-12">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 text-xs font-sans transition-colors duration-[var(--transition-fast)]"
              style={{
                color: isActive ? "var(--fg-primary)" : "var(--fg-muted)",
              }}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
