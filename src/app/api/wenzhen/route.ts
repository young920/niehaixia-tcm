/**
 * /api/wenzhen — AI 问诊后端
 *
 * 接收对话消息，以倪海厦六经辨证思维引导问诊，返回辨证结果。
 * 使用 OpenAI-compatible API（支持青霄云 / DeepSeek / Moonshot / 本地模型等）。
 *
 * 环境变量（在 .env.local 中配置）：
 *   AI_API_KEY   — 必填，API 密钥
 *   AI_API_BASE  — 可选，API 基地址（默认 https://api.openai.com/v1）
 *   AI_MODEL     — 可选，模型名（默认 gpt-4o）
 */

import { NextRequest, NextResponse } from "next/server";

// ── 环境变量 ──────────────────────────────────────────────
const API_KEY = process.env.AI_API_KEY;
const API_BASE = process.env.AI_API_BASE ?? "https://api.openai.com/v1";
const MODEL = process.env.AI_MODEL ?? "gpt-4o";

// ── 类型 ──────────────────────────────────────────────────
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const LIUJING_KEYS = [
  "taiyang",
  "yangming",
  "shaoyang",
  "taiyin",
  "shaoyin",
  "jueyin",
] as const;
type LiujingKey = (typeof LIUJING_KEYS)[number];

// ── 系统提示（倪海厦六经辨证核心框架）──────────────────────
const SYSTEM_PROMPT = `你是倪海厦经方中医AI问诊助手。你必须严格遵循倪海厦的六经辨证思维体系来引导问诊和给出辨证结论。

## 核心心智模型
- 六经辨证：太阳→阳明→少阳→太阴→少阴→厥阴，疾病由表入里传变
- 阳气论：阳气不足先扶阳，保护阳气是第一要务
- 经典至上：以《伤寒论》《金匮要略》原文为最高依据
- 经方为主：首选伤寒金匮原方，不随意加减

## 六经辨证快速诊断
1. **太阳经**（表证·初起）：恶寒发热、头项强痛、脉浮。风寒用麻黄汤/桂枝汤。
2. **阳明经**（里热·炽盛）：身热汗出、不恶寒反恶热、口渴、脉洪大。白虎汤/承气汤类。
3. **少阳经**（半表半里）：口苦咽干目眩、往来寒热、胸胁苦满、脉弦。小柴胡汤。
4. **太阴经**（脾寒·湿困）：腹满而吐、食不下、自利、脉缓弱。理中汤/桂枝加芍药汤。
5. **少阴经**（心肾阳虚）：但欲寐、四肢厥冷、下利清谷、脉微细。四逆汤/真武汤。
6. **厥阴经**（阴阳逆乱）：消渴、气上撞心、心中疼热、饥而不欲食。乌梅丸。

## 七步辨证思维
1. 先辨六经（定病位）
2. 再辨寒热（定病性）
3. 再辨虚实（定邪正）
4. 合病并病需分清
5. 真寒假热要鉴别（四肢温度、口渴真假、面色）
6. 选方用药遵经方
7. 预后判断看阳气

## 问诊原则
- 逐步引导，一次问2-3个关键症状
- 重点关注：寒热、汗出、口渴、二便、睡眠、食欲
- 望闻问切中，问诊为主，舌脉参考
- 不确定时宁可多问，不轻易下结论

## 输出格式
回答完患者问题后，在最后一行标注辨证归属，格式为：
[六经:xxx]
其中 xxx 只能是：taiyang / yangming / shaoyang / taiyin / shaoyin / jueyin
如果暂时无法确定六经归属，标注 [六经:待定]

重要：你的所有回答必须基于倪海厦经方思维，不得混入其他中医流派观点。用通俗易懂的语言解释，必要时引用《伤寒论》原文。`;

// ── 从 AI 回复中提取六经归属 ─────────────────────────────
function extractLiujing(content: string): LiujingKey | undefined {
  const match = content.match(/\[六经:([a-z]+)\]/);
  if (!match) return undefined;
  const key = match[1] as LiujingKey;
  if (LIUJING_KEYS.includes(key)) return key;
  return undefined;
}

// ── 去除六经标记（不在前端展示）──────────────────────────
function stripLiujingTag(content: string): string {
  return content.replace(/\n?\[六经:[a-z]+\]\s*$/, "").trimEnd();
}

// ── POST 处理 ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // 校验 API Key
  if (!API_KEY) {
    return NextResponse.json(
      { error: "AI_API_KEY 未配置，请在 .env.local 中设置" },
      { status: 500 }
    );
  }

  // 解析请求体
  let body: { messages?: Array<{ role: string; content: string }> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "请求体格式错误" },
      { status: 400 }
    );
  }

  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json(
      { error: "messages 不能为空" },
      { status: 400 }
    );
  }

  // 构建消息列表（system + 用户对话历史）
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...body.messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  // 调用 AI API
  try {
    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      return NextResponse.json(
        { error: `AI API 返回错误 ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawContent: string = data.choices?.[0]?.message?.content ?? "";

    if (!rawContent) {
      return NextResponse.json(
        { error: "AI 未返回有效内容" },
        { status: 502 }
      );
    }

    // 提取六经归属并清理标记
    const liujing = extractLiujing(rawContent);
    const content = stripLiujingTag(rawContent);

    return NextResponse.json({ content, liujing });
  } catch (err) {
    return NextResponse.json(
      { error: "AI 服务请求失败，请稍后重试" },
      { status: 502 }
    );
  }
}
