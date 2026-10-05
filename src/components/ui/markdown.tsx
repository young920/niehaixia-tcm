"use client";

import { useMemo } from "react";

/**
 * 轻量 Markdown 渲染组件（仅预览，非编辑器）
 * 零依赖，覆盖 AI 返回的常见格式：
 * - 标题 ## / ###
 * - 粗体 **text**
 * - 无序列表 - item
 * - 有序列表 1. item
 * - 分隔线 ---
 * - 行内代码 `code`
 * - 段落换行
 */

interface MarkdownProps {
  content: string;
  className?: string;
}

interface ParsedNode {
  type: "h2" | "h3" | "p" | "ul" | "ol" | "hr" | "code-block";
  content?: string;
  items?: string[];
  lang?: string;
}

function parseMarkdown(text: string): ParsedNode[] {
  const lines = text.split("\n");
  const nodes: ParsedNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 空行跳过
    if (!line.trim()) {
      i++;
      continue;
    }

    // 分隔线 ---
    if (/^---+\s*$/.test(line)) {
      nodes.push({ type: "hr" });
      i++;
      continue;
    }

    // 标题 ##
    if (/^###\s/.test(line)) {
      nodes.push({ type: "h3", content: line.replace(/^###\s*/, "") });
      i++;
      continue;
    }
    if (/^##\s/.test(line)) {
      nodes.push({ type: "h2", content: line.replace(/^##\s*/, "") });
      i++;
      continue;
    }

    // 代码块 ```
    if (line.trim().startsWith("```")) {
      const lang = line.trim().replace(/^```/, "").trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      nodes.push({ type: "code-block", content: codeLines.join("\n"), lang });
      continue;
    }

    // 无序列表 - (连续的列表项合并为一个 ul)
    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s*/, ""));
        i++;
      }
      nodes.push({ type: "ul", items });
      continue;
    }

    // 有序列表 1. (连续的列表项合并为一个 ol)
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s*/, ""));
        i++;
      }
      nodes.push({ type: "ol", items });
      continue;
    }

    // 普通段落（连续非空行合并）
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^##/.test(lines[i]) &&
      !/^---+\s*$/.test(lines[i]) &&
      !/^[-*]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !lines[i].trim().startsWith("```")
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      nodes.push({ type: "p", content: paraLines.join("\n") });
    }
  }

  return nodes;
}

/** 行内格式：粗体 + 行内代码 */
function Inline({ text }: { text: string }) {
  const parts = useMemo(() => {
    const result: { type: "text" | "bold" | "code"; value: string }[] = [];
    const codeSplit = text.split(/(`[^`]+`)/g);
    for (const segment of codeSplit) {
      const codeMatch = segment.match(/^`([^`]+)`$/);
      if (codeMatch) {
        result.push({ type: "code", value: codeMatch[1] });
      } else {
        const boldSplit = segment.split(/(\*\*[^*]+\*\*)/g);
        for (const sub of boldSplit) {
          const boldMatch = sub.match(/^\*\*([^*]+)\*\*$/);
          if (boldMatch) {
            result.push({ type: "bold", value: boldMatch[1] });
          } else if (sub) {
            result.push({ type: "text", value: sub });
          }
        }
      }
    }
    return result;
  }, [text]);

  return (
    <>
      {parts.map((p, idx) => {
        if (p.type === "bold") {
          return <strong key={idx} className="font-semibold text-fg-primary">{p.value}</strong>;
        }
        if (p.type === "code") {
          return (
            <code key={idx} className="bg-bg-surface px-1.5 py-0.5 rounded text-xs font-mono text-fg-secondary">
              {p.value}
            </code>
          );
        }
        return p.value.split("\n").map((line, lineIdx) => (
          <span key={`${idx}-${lineIdx}`}>
            {lineIdx > 0 && <br />}
            {line}
          </span>
        ));
      })}
    </>
  );
}

export function Markdown({ content, className = "" }: MarkdownProps) {
  const nodes = useMemo(() => parseMarkdown(content), [content]);

  return (
    <div className={`markdown-body ${className}`}>
      {nodes.map((node, idx) => {
        switch (node.type) {
          case "h2":
            return (
              <h2 key={idx} className="font-sans text-base text-fg-primary mt-6 mb-3 pb-2 border-b border-[var(--border-copper)]">
                <Inline text={node.content!} />
              </h2>
            );
          case "h3":
            return (
              <h3 key={idx} className="font-sans text-sm text-fg-primary mt-5 mb-2">
                <Inline text={node.content!} />
              </h3>
            );
          case "p":
            return (
              <p key={idx} className="text-sm text-fg-secondary leading-relaxed mb-3">
                <Inline text={node.content!} />
              </p>
            );
          case "ul":
            return (
              <ul key={idx} className="list-none space-y-1.5 mb-3 pl-4">
                {node.items!.map((item, i) => (
                  <li key={i} className="text-sm text-fg-secondary leading-relaxed flex items-start gap-2">
                    <span className="text-fg-muted mt-1.5 shrink-0">·</span>
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={idx} className="list-none space-y-1.5 mb-3 pl-4">
                {node.items!.map((item, i) => (
                  <li key={i} className="text-sm text-fg-secondary leading-relaxed flex items-start gap-2">
                    <span className="font-sans text-xs text-fg-muted mt-0.5 shrink-0">{i + 1}.</span>
                    <Inline text={item} />
                  </li>
                ))}
              </ol>
            );
          case "hr":
            return <hr key={idx} className="border-t border-[var(--border-copper)] my-5" />;
          case "code-block":
            return (
              <pre key={idx} className="bg-bg-surface rounded-[var(--card-radius)] p-4 mb-3 overflow-x-auto">
                <code className="text-xs font-mono text-fg-secondary leading-relaxed whitespace-pre">
                  {node.content}
                </code>
              </pre>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
