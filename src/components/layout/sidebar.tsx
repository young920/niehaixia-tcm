"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/wenzhen", label: "问诊", chapter: "壹" },
  { href: "/liujing", label: "六经", chapter: "贰" },
  { href: "/fangji", label: "方剂", chapter: "叁" },
  { href: "/bencao", label: "本草", chapter: "肆" },
  { href: "/yian", label: "医案", chapter: "伍" },
] as const;

/**
 * 一保堂式 Sidebar — 白底、极细线、大量留白
 * 章节编号小号暖棕色，目录条目轻盈无重量
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[var(--side-nav-width)] min-h-screen bg-sidebar border-r border-[var(--border-copper)] px-[var(--grid-outer)] py-10">
      <Link href="/" className="mb-10 group">
        <h1 className="font-sans text-lg text-fg-primary tracking-wide group-hover:text-fg-muted transition-colors duration-[var(--transition-fast)]">
          倪海厦
        </h1>
        <p className="engraving-label mt-1.5">
          CLASSICAL CHINESE MEDICINE
        </p>
      </Link>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 px-2 py-2.5 transition-colors duration-[var(--transition-fast)]"
              style={{
                backgroundColor: isActive ? "rgba(0, 0, 0, 0.04)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(0, 0, 0, 0.02)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              <span
                className="font-sans text-xs w-5 text-center tracking-widest transition-colors duration-[var(--transition-fast)]"
                style={{ color: isActive ? "var(--accent-primary)" : "var(--fg-muted)" }}
              >
                {item.chapter}
              </span>
              <span
                className="font-sans text-sm transition-colors duration-[var(--transition-fast)]"
                style={{ color: isActive ? "var(--fg-primary)" : "var(--fg-secondary)" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer — minimal colophon */}
      <div className="mt-auto pt-8" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.06)" }}>
        <p className="text-xs leading-relaxed font-sans" style={{ color: "var(--fg-muted)" }}>
          基于倪海厦（1954-2012）<br />
          经方体系 · 仅供学习研究
        </p>
      </div>
    </aside>
  );
}
