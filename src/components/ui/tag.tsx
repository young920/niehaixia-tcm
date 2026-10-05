import type { ReactNode } from "react";

type LiujingKey = "taiyang" | "yangming" | "shaoyang" | "taiyin" | "shaoyin" | "jueyin";

interface TagProps {
  variant?: LiujingKey | "default";
  children: ReactNode;
}

/**
 * 铜版药典 Tag — 铜版插图标签
 * 左侧4px粗竖线 + 羊皮纸底 + 衬线体
 * 像铜版插图上的分类铭牌
 */
export function Tag({ variant = "default", children }: TagProps) {
  const barColor =
    variant === "default"
      ? "var(--color-sepia)"
      : `var(--liujing-${variant})`;

  return (
    <span
      className="inline-flex items-center gap-0 bg-vellum-warm rounded-none px-2.5 py-0.5 text-xs font-serif"
      style={{
        borderLeft: `4px solid ${barColor}`,
        color: barColor,
        boxShadow: "inset 0 0 0 1px var(--border-sepia-light)",
      }}
    >
      {children}
    </span>
  );
}
