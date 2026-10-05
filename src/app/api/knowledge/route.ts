/**
 * /api/knowledge — 知识库查询后端
 *
 * 支持三个域：fangji（经方速查）、bencao（本草查询）、yian（医案检索）
 * 基于 AI + 倪海厦知识库体系，返回结构化查询结果。
 */

import { NextRequest, NextResponse } from "next/server";

// Cloudflare Pages Edge Runtime 必需声明
export const runtime = "edge";

const API_KEY = process.env.AI_API_KEY;
const API_BASE = process.env.AI_API_BASE ?? "https://api.openai.com/v1";
const MODEL = process.env.AI_MODEL ?? "gpt-4o";

// ── 域定义 ────────────────────────────────────────────────
type Domain = "fangji" | "bencao" | "yian";

const DOMAIN_PROMPTS: Record<Domain, string> = {
  fangji: `你是倪海厦经方中医AI，专注于经方（伤寒论+金匮要略）查询。
知识范围：伤寒论129条全部经方 + 金匮要略23篇经方。
回答格式：
- **方名**
- 组成（药物+剂量）
- 煎服法
- 主治（对应六经+症状）
- 禁忌
- 《伤寒论》/《金匮要略》原文引用

如果用户没有指定具体方剂，列出相关方剂供选择。所有回答基于倪海厦经方体系。`,

  bencao: `你是倪海厦经方中医AI，专注于神农本草经药物查询。
知识范围：神农本草经345种药物（上经127种/中经101种/下经117种）。
回答格式：
- **药名**
- 三品分类（上品/中品/下品）
- 性味（五味·寒热）
- 归经
- 主治功效
- 倪师临床用法与要点
- 炮制要求
- 禁忌

如果用户没有指定具体药物，列出相关药物供选择。所有回答基于倪海厦药性理论。`,

  yian: `你是倪海厦经方中医AI，专注于医案检索与分析。
知识范围：849例倪海厦真实临床医案（人纪班医案集+闭门课医案），覆盖癌症/心血管/代谢病/消化系统/呼吸系统/妇科等。
回答格式：
- **疾病/症状**
- 患者基本信息（如有）
- 六经辨证归属
- 选方用药
- 疗效与转归
- 倪师辨证思路解析

用户可按疾病名称、症状、六经、方剂等维度检索。所有分析基于倪海厦临床思维。`,
};

const BASE_PROMPT = `你是倪海厦经方中医知识库助手。严格遵循倪海厦经方思维体系，所有回答必须有经典依据。

重要规则：
1. 只回答有依据的内容，不确定时说明
2. 引用《伤寒论》《金匮要略》《神农本草经》原文
3. 保持客观，不做超出知识库范围的医疗建议
4. 回答简洁实用，便于快速查阅`;

// ── POST ──────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "AI_API_KEY 未配置，请在 .env.local 中设置" },
      { status: 500 }
    );
  }

  let body: { domain?: string; query?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求体格式错误" }, { status: 400 });
  }

  const domain = body.domain as Domain | undefined;
  const query = body.query;

  if (!domain || !DOMAIN_PROMPTS[domain]) {
    return NextResponse.json(
      { error: "domain 必须为 fangji / bencao / yian" },
      { status: 400 });
  }

  if (!query || typeof query !== "string" || !query.trim()) {
    return NextResponse.json({ error: "query 不能为空" }, { status: 400 });
  }

  const systemPrompt = `${BASE_PROMPT}\n\n${DOMAIN_PROMPTS[domain]}`;

  try {
    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
        temperature: 0.5,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `AI API 返回错误 ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content: string = data.choices?.[0]?.message?.content ?? "";

    if (!content) {
      return NextResponse.json(
        { error: "AI 未返回有效内容" },
        { status: 502 }
      );
    }

    return NextResponse.json({ content });
  } catch {
    return NextResponse.json(
      { error: "AI 服务请求失败，请稍后重试" },
      { status: 502 }
    );
  }
}
