import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const SYSTEM_PROMPT = `You are WePet AI Assistant, a friendly and knowledgeable pet care companion in the WePet social network app. Your role is to:

1. Help pet owners with questions about pet health, training, nutrition, and behavior
2. Assist in setting up playdates and meetups between pets
3. Provide personalized advice based on the conversation context
4. Be warm, encouraging, and supportive

Guidelines:
- Keep responses concise (2-4 sentences max) and conversational
- Use a friendly, caring tone
- If the user writes in Korean, respond in Korean
- If the user writes in Chinese, respond in Chinese
- Otherwise respond in English
- When discussing health concerns, always recommend consulting a veterinarian for serious issues
- Be enthusiastic about pet socialization and playdates
- You can suggest features of the WePet app like the Growth Journal, AI Matching, and Explore map`

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

function generateSuggestions(userMessage: string, aiResponse: string): string[] {
  const lowerMsg = userMessage.toLowerCase()
  const hasKorean = /[\uAC00-\uD7AF]/.test(userMessage + aiResponse)
  const hasChinese = /[\u4E00-\u9FFF]/.test(userMessage + aiResponse)

  if (hasKorean) {
    if (lowerMsg.includes("건강") || lowerMsg.includes("병원") || lowerMsg.includes("아프")) {
      return ["예방 접종 일정 알려주세요", "강아지 영양제 추천해주세요", "정기 검진은 얼마나 자주 해야 하나요?"]
    }
    if (lowerMsg.includes("훈련") || lowerMsg.includes("행동")) {
      return ["기본 명령어 훈련법 알려주세요", "분리불안 해결 방법은?", "산책 훈련 팁 알려주세요"]
    }
    if (lowerMsg.includes("만나") || lowerMsg.includes("산책") || lowerMsg.includes("플레이")) {
      return ["이번 주말에 만날 수 있나요?", "어디서 만나는 게 좋을까요?", "첫 만남 팁 알려주세요"]
    }
    return ["우리 강아지 건강 상담하고 싶어요", "산책 친구를 찾고 싶어요", "훈련 팁을 알려주세요"]
  }

  if (hasChinese) {
    if (lowerMsg.includes("健康") || lowerMsg.includes("医院") || lowerMsg.includes("生病")) {
      return ["疫苗接种时间表是什么？", "推荐一些宠物营养品", "多久做一次体检？"]
    }
    if (lowerMsg.includes("训练") || lowerMsg.includes("行为")) {
      return ["基本命令训练方法", "如何解决分离焦虑？", "散步训练技巧"]
    }
    if (lowerMsg.includes("见面") || lowerMsg.includes("散步") || lowerMsg.includes("约")) {
      return ["这个周末可以见面吗？", "在哪里见面比较好？", "第一次见面有什么建议？"]
    }
    return ["我想咨询宠物健康问题", "我想找散步伙伴", "给我一些训练建议"]
  }

  // English
  if (lowerMsg.includes("health") || lowerMsg.includes("vet") || lowerMsg.includes("sick")) {
    return ["What vaccinations does my pet need?", "Any supplement recommendations?", "How often should I visit the vet?"]
  }
  if (lowerMsg.includes("train") || lowerMsg.includes("behav")) {
    return ["How to teach basic commands?", "Tips for separation anxiety?", "Leash training advice?"]
  }
  if (lowerMsg.includes("meet") || lowerMsg.includes("play") || lowerMsg.includes("walk")) {
    return ["Are you free this weekend?", "Where should we meet?", "Any tips for first meetups?"]
  }
  return ["I'd like pet health advice", "Help me find walking buddies", "Give me some training tips"]
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, history } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Please set OPENAI_API_KEY in .env.local" },
        { status: 500 }
      )
    }

    const openai = new OpenAI({ apiKey })

    // Build messages array for ChatGPT
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ]

    // Add conversation history (last 10 messages for context)
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        })
      }
    }

    // Add current user message
    messages.push({ role: "user", content: message })

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 300,
      temperature: 0.8,
    })

    const aiResponse = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response. Please try again!"
    const suggestions = generateSuggestions(message, aiResponse)

    return NextResponse.json({
      response: aiResponse,
      suggestions,
    })
  } catch (error: unknown) {
    console.error("AI Chat API error:", error)

    let errorMessage = "Failed to generate response"
    if (error instanceof Error) {
      if (error.message.includes("API key") || error.message.includes("auth")) {
        errorMessage = "Invalid API key. Please check your OPENAI_API_KEY."
      } else if (error.message.includes("quota") || error.message.includes("rate")) {
        errorMessage = "API rate limit reached. Please try again later."
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
