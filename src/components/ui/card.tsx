import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-bg-card rounded-[var(--card-radius)] shadow-[var(--shadow-card)] p-5
        ${hover ? "transition-shadow duration-[var(--transition-fast)] hover:shadow-[var(--shadow-thumbnail)]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
