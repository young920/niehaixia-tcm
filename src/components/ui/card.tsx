import type { ReactNode } from "react";

type Variant = "default" | "drawer";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  default: "bg-bg-card border-t border-wood-light",
  drawer: "bg-bg-card border-t-2 border-wood",
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
        ${hover ? "transition-[border-color] duration-[var(--transition-fast)] hover:border-accent-primary/40" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
