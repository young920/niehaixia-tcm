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
 * default: 单线框 + 羊皮纸底
 * plate:   双线框 (plate-frame) + 内衬留白
 */
const VARIANT_CLASSES: Record<Variant, string> = {
  default: "bg-bg-card border border-sepia",
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
        ${VARIANT_CLASSES[variant]}
        ${hover ? "transition-[border-color,opacity] duration-[var(--transition-fast)] hover:border-copper hover:opacity-90" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
