import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "border border-wood bg-transparent text-fg-primary rounded-none px-6 py-2.5 text-sm font-sans transition-[background-color,color,border-color] duration-[var(--transition-fast)] hover:bg-accent-primary hover:text-fg-inverse hover:border-accent-primary",
  secondary:
    "bg-transparent border border-brass text-fg-secondary rounded-[var(--pill-radius)] px-6 py-2.5 text-sm font-sans transition-[background-color,color] duration-[var(--transition-fast)] hover:bg-brass hover:text-fg-inverse",
  ghost:
    "bg-transparent text-accent-primary text-sm font-sans transition-[opacity] duration-[var(--transition-fast)] hover:opacity-70 underline-offset-2 hover:underline",
};

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  return (
    <button className={`${VARIANT_CLASSES[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
