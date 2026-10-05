import type { ReactNode } from "react";

type Variant = "default" | "plate";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  variant?: Variant;
}

/**
 * 铜版药典 Card — 雕刻铜版插图式
 * default: 铜色顶线 + 羊皮纸底 + 墨色边框
 * plate:   双线框 (plate-frame) + 内阴影
 */
const VARIANT_CLASSES: Record<Variant, string> = {
  default: "bg-bg-card border border-sepia-thick border-t-[3px] border-t-copper",
  plate: "plate-frame",
};

export function Card({
  children,
  className = "",
  hover = false,
  variant = "default",
}: CardProps) {
  return (
    <div
      className={`
        rounded-[var(--card-radius)] p-5
        shadow-[var(--shadow-card)]
        ${VARIANT_CLASSES[variant]}
        ${hover ? "transition-[border-color,box-shadow,opacity] duration-[var(--transition-fast)] hover:border-copper hover:shadow-[var(--shadow-elevated)] hover:opacity-95" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
