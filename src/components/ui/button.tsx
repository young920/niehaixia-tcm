import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

/**
 * 铜版药典 Button — 雕刻标签式
 * primary:   铜色线框 + 透明底 → hover 填铜色
 * secondary: 细线 + 羊皮纸底
 * ghost:     无框 + 铜色下划线
 */
const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "border border-copper bg-transparent text-fg-primary rounded-none px-6 py-2.5 text-sm font-serif tracking-wider transition-[background-color,color,border-color] duration-[var(--transition-fast)] hover:bg-copper hover:text-fg-inverse hover:border-copper",
  secondary:
    "bg-vellum-warm border border-sepia text-fg-secondary rounded-none px-6 py-2.5 text-sm font-serif transition-[background-color,border-color] duration-[var(--transition-fast)] hover:bg-surface hover:border-copper",
  ghost:
    "bg-transparent text-accent-primary text-sm font-serif transition-[opacity] duration-[var(--transition-fast)] hover:opacity-70 underline-offset-4 hover:underline decoration-copper/40",
};

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  return (
    <button className={`${VARIANT_CLASSES[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
