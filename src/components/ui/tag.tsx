import type { ReactNode } from "react";

type LiujingKey = "taiyang" | "yangming" | "shaoyang" | "taiyin" | "shaoyin" | "jueyin";

interface TagProps {
  variant?: LiujingKey | "default";
  children: ReactNode;
}

/**
 * 铜版药典 Tag — 植物版画标签
 * 左侧铜色竖线 + 羊皮纸底 + 衬线体
 * 像植物插图上的分类标签
 */
export function Tag({ variant = "default", children }: TagProps) {
  const barColor =
    variant === "default"
      ? "var(--color-sepia)"
      : `var(--liujing-${variant})`;

  return (
    <span
      className="inline-flex items-center gap-0 bg-vellum-warm rounded-none px-2.5 py-0.5 text-xs font-serif"
      style={{ borderLeft: `3px solid ${barColor}`, color: barColor }}
    >
      {children}
    </span>
  );
}
