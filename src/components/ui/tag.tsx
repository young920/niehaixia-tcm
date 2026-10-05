import type { ReactNode } from "react";

type LiujingKey = "taiyang" | "yangming" | "shaoyang" | "taiyin" | "shaoyin" | "jueyin";

interface TagProps {
  variant?: LiujingKey | "default";
  children: ReactNode;
}

const COLOR_MAP: Record<string, string> = {
  taiyang: "bg-liujing-taiyang/15 text-liujing-taiyang",
  yangming: "bg-liujing-yangming/15 text-liujing-yangming",
  shaoyang: "bg-liujing-shaoyang/15 text-liujing-shaoyang",
  taiyin: "bg-liujing-taiyin/15 text-liujing-taiyin",
  shaoyin: "bg-liujing-shaoyin/15 text-liujing-shaoyin",
  jueyin: "bg-liujing-jueyin/15 text-liujing-jueyin",
  default: "bg-fg-muted/10 text-fg-secondary",
};

export function Tag({ variant = "default", children }: TagProps) {
  return (
    <span
      className={`inline-block rounded-[var(--pill-radius)] px-3 py-1 text-xs font-medium ${COLOR_MAP[variant]}`}
    >
      {children}
    </span>
  );
}
