import type { ReactNode } from "react";

type LiujingKey = "taiyang" | "yangming" | "shaoyang" | "taiyin" | "shaoyin" | "jueyin";

interface TagProps {
  variant?: LiujingKey | "default";
  children: ReactNode;
}

/**
 * 药柜签条风格 — 左侧色条 + 纸色底 + 衬线字
 * 模拟中药柜抽屉上的标签签条
 */
export function Tag({ variant = "default", children }: TagProps) {
  const barColor =
    variant === "default"
      ? "var(--color-wood)"
      : `var(--liujing-${variant})`;

  return (
    <span
      className="inline-flex items-center gap-0 bg-paper-warm rounded-none px-2.5 py-0.5 text-xs font-serif"
      style={{ borderLeft: `3px solid ${barColor}`, color: barColor }}
    >
      {children}
    </span>
  );
}
