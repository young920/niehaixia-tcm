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
 * 铜版药典 MobileNav — 书签式底部导航
 * 皮革色底 + 铜色顶线 + 铜色活跃标识
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#3c2a1a] border-t border-copper/30">
      <div className="flex justify-around items-center h-14">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 text-xs font-serif transition-colors duration-[var(--transition-fast)]"
              style={{
                color: isActive ? "var(--color-copper)" : "#8a7a68",
                borderTop: isActive ? "2px solid var(--color-copper)" : "2px solid transparent",
                paddingTop: "2px",
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
