import Link from "next/link";

/**
 * 铜版药典 Header — 书名页式
 * 顶栏：深色皮革 + 铜色细线底部
 * 品牌名浅色衬线体 + 药典副标
 */
export function Header() {
  return (
    <header className="lg:hidden sticky top-0 z-40 leather-bg border-b border-copper/30 px-[var(--grid-outer)] py-3">
      <div className="flex items-center justify-between">
        <Link href="/">
          <h1 className="font-serif text-base text-[#d4c4a8] tracking-wide">倪海厦·经方中医</h1>
        </Link>
        <span className="engraving-label text-[#8a7050]">PHARMACOPOEIA</span>
      </div>
    </header>
  );
}
