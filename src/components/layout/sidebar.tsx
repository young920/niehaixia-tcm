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
 * 铜版药典 Sidebar — 皮革书脊 + 书卷目录
 * 深色皮革质感背景，右侧铜色书脊线
 * 章节编号大号铜色，目录条目如药典章节
 * 底部为出版信息式版权（colophon）
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[var(--side-nav-width)] min-h-screen leather-bg book-spine px-[var(--grid-outer)] py-8">
      <Link href="/" className="mb-8 group">
        <h1 className="font-serif text-2xl text-[#d4c4a8] tracking-wide group-hover:text-[#e8d8b8] transition-colors duration-[var(--transition-fast)]">
          倪海厦
        </h1>
        <p className="engraving-label mt-1.5 text-[#a08860] group-hover:text-[#b8a070] transition-colors duration-[var(--transition-fast)]">
          COPPERPLATE PHARMACOPOEIA
        </p>
      </Link>

      {/* Decorative rule — copper divider */}
      <div className="flex items-center gap-2 mb-6" style={{ color: "var(--color-copper)" }}>
        <span className="text-[0.6rem]">❧</span>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, var(--color-copper), transparent)" }} />
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-4 px-3 py-3 transition-all duration-[var(--transition-fast)]"
              style={{
                backgroundColor: isActive ? "rgba(160, 112, 48, 0.15)" : "transparent",
                borderLeft: isActive ? "3px solid var(--color-copper)" : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(160, 112, 48, 0.08)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              <span
                className="font-serif text-lg w-7 text-center tracking-widest transition-colors duration-[var(--transition-fast)]"
                style={{ color: isActive ? "var(--color-copper)" : "#8a7060" }}
              >
                {item.chapter}
              </span>
              <span
                className="font-serif text-sm transition-colors duration-[var(--transition-fast)]"
                style={{ color: isActive ? "#d4c4a8" : "#9a8a78" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Colophon — book publication info */}
      <div className="mt-auto pt-8" style={{ borderTop: "1px solid rgba(160, 112, 48, 0.25)" }}>
        <div className="flex items-center gap-2 mb-3">
          <span style={{ color: "var(--color-copper)", fontSize: "0.5rem" }}>◆</span>
          <span className="engraving-label text-[#7a6a58]">COLOPHON</span>
        </div>
        <p className="text-xs leading-relaxed font-serif" style={{ color: "#7a6a58" }}>
          基于倪海厦（1954-2012）<br />
          经方体系 · 仅供学习研究
        </p>
      </div>
    </aside>
  );
}
