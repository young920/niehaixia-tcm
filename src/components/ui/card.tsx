import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

/**
 * 一保堂式 Card — 极轻卡片
 * 近白底 + 极细边线 + 微阴影
 */
export function Card({
  children,
  className = "",
  hover = false,
}: CardProps) {
  return (
    <div
      className={`
        rounded-[var(--card-radius)] p-5
        bg-bg-card border border-[var(--border-copper)]
        shadow-[var(--shadow-card)]
        ${hover ? "transition-shadow duration-[var(--transition-fast)] hover:shadow-[var(--shadow-elevated)]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
