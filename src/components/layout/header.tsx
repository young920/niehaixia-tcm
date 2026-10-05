import Link from "next/link";

/**
 * 一保堂式 Header — 白底、极轻
 */
export function Header() {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-bg-base border-b border-[var(--border-copper)] px-[var(--grid-outer)] py-3">
      <div className="flex items-center justify-between">
        <Link href="/">
          <h1 className="font-sans text-sm text-fg-primary tracking-wide">倪海厦·经方中医</h1>
        </Link>
        <span className="engraving-label">CLASSICAL MEDICINE</span>
      </div>
    </header>
  );
}
