import type { ReactNode } from "react";

type LiujingKey = "taiyang" | "yangming" | "shaoyang" | "taiyin" | "shaoyin" | "jueyin";

interface TagProps {
  variant?: LiujingKey | "default";
  children: ReactNode;
}

/**
 * 一保堂式 Tag — 极轻标签
 * 左侧2px细线 + 白底 + 小字
 */
export function Tag({ variant = "default", children }: TagProps) {
  const barColor =
    variant === "default"
      ? "var(--fg-muted)"
      : `var(--liujing-${variant})`;

  return (
    <span
      className="inline-flex items-center gap-0 bg-bg-card rounded-[var(--card-radius)] px-2 py-0.5 text-xs font-sans"
      style={{
        borderLeft: `2px solid ${barColor}`,
        color: barColor,
      }}
    >
      {children}
    </span>
  );
}
