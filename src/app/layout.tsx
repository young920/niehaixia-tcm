import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "倪海厦·经方中医问诊",
  description: "基于倪海厦经方体系的AI中医问诊系统 — 六经辨证 · 经方选药 · 医案检索",
  keywords: ["倪海厦", "经方", "中医", "六经辨证", "伤寒论", "金匮要略", "问诊"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500&family=Noto+Serif+SC:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
