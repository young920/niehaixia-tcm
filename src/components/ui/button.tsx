import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-accent-primary text-fg-inverse rounded-none px-6 py-2.5 text-sm font-sans transition-[opacity] duration-[var(--transition-fast)] hover:opacity-90",
  secondary:
    "bg-transparent border border-fg-primary text-fg-primary rounded-[var(--pill-radius)] px-6 py-2.5 text-sm font-sans transition-[background-color] duration-[var(--transition-fast)] hover:bg-fg-primary hover:text-fg-inverse",
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
