import Link from "next/link";

export function Header() {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-bg-base border-b border-divider-wood px-[var(--grid-outer)] py-3">
      <div className="flex items-center justify-between">
        <Link href="/">
          <h1 className="font-serif text-base text-accent-ink">倪海厦·经方中医</h1>
        </Link>
        <span className="text-xs text-brass font-serif tracking-[0.2em]">问诊</span>
      </div>
    </header>
  );
}
