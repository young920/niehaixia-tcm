import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

/**
 * 一保堂式 Button — 极轻按钮
 * primary:   暖棕底 + 白字
 * secondary: 白底 + 细边
 * ghost:     无框文字
 */
const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-[var(--accent-primary)] text-fg-inverse rounded-[var(--card-radius)] px-5 py-2 text-sm font-sans tracking-wider transition-[opacity] duration-[var(--transition-fast)] hover:opacity-85",
  secondary:
    "bg-bg-card border border-[var(--border-copper-thick)] text-fg-secondary rounded-[var(--card-radius)] px-5 py-2 text-sm font-sans transition-[border-color] duration-[var(--transition-fast)] hover:border-[var(--accent-primary)]",
  ghost:
    "bg-transparent text-fg-muted text-sm font-sans transition-[color] duration-[var(--transition-fast)] hover:text-fg-primary",
};

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  return (
    <button className={`${VARIANT_CLASSES[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
