import Link from "next/link";

/**
 * 铜版药典 Header — 书名页式
 * 固定顶栏，羊皮纸底 + 铜色细线
 * 品牌名衬线体 + 章节标签
 */
export function Header() {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-bg-base border-b border-divider-rule px-[var(--grid-outer)] py-3">
      <div className="flex items-center justify-between">
        <Link href="/">
          <h1 className="font-serif text-base text-accent-ink">倪海厦·经方中医</h1>
        </Link>
        <span className="engraving-label">PHARMACOPOEIA</span>
      </div>
    </header>
  );
}
