import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export const runtime = "nodejs"

// 系统提示词（保留你的）
const SYSTEM_PROMPT = `You are WePet AI Assistant, a friendly and knowledgeable pet care companion in the WePet social network app...`

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

// 👇 你的建议函数（原样保留）
function generateSuggestions(userMessage: string, aiResponse: string): string[] {
  const lowerMsg = userMessage.toLowerCase()
  const hasKorean = /[\uAC00-\uD7AF]/.test(userMessage + aiResponse)
  const hasChinese = /[\u4E00-\u9FFF]/.test(userMessage + aiResponse)

  if (hasKorean) {
    return ["산책 친구 찾기", "건강 상담", "훈련 팁"]
  }

  if (hasChinese) {
    return ["宠物健康建议", "找遛狗伙伴", "训练方法"]
  }

  return ["Pet health advice", "Find walking buddies", "Training tips"]
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, history } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
          { error: "Missing OPENAI_API_KEY" },
          { status: 500 }
      )
    }

    const openai = new OpenAI({ apiKey })

    // 构建消息
    const messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ]

    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        messages.push({
          role: msg.role,
          content: msg.content,
        })
      }
    }

    messages.push({ role: "user", content: message })

    // 🔥 核心调用（已修复）
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 300,
      temperature: 0.8,
    })

    const aiResponse =
        completion.choices[0]?.message?.content ||
        "Sorry, something went wrong."

    const suggestions = generateSuggestions(message, aiResponse)

    return NextResponse.json({
      response: aiResponse,
      suggestions,
    })

  } catch (error: any) {
    console.error("AI ERROR:", error)

    return NextResponse.json(
        {
          error: error.message || "Server error",
        },
        { status: 500 }
    )
  }
}