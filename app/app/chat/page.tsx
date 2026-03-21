"use client"

import { useState } from "react"
import { Send, MoreVertical, ChevronLeft, Bot, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLanguage } from "@/lib/i18n/language-context"

export default function ChatPage() {
  const { t } = useLanguage()

  const [messages, setMessages] = useState([
    { id: 1, text: t.chat.messages[0], sender: "other", time: "10:00 AM" },
    { id: 2, text: t.chat.messages[1], sender: "me", time: "10:05 AM" },
    { id: 3, text: t.chat.messages[2], sender: "other", time: "10:15 AM" },
  ])

  const [aiSuggestions, setAiSuggestions] = useState(t.chat.suggestions)
  const [inputText, setInputText] = useState("")
  const [isAiThinking, setIsAiThinking] = useState(false)

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    const newMessage = {
      id: Date.now(),
      text,
      sender: "me" as const,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputText("")
    setAiSuggestions([])
    setIsAiThinking(true)

    try {
      const history = messages.map((m) => ({
        role: m.sender === "me" ? "user" : "assistant",
        content: m.text,
      }))

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: data.response,
            sender: "other" as const,
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          },
        ])
        if (data.suggestions) {
          setAiSuggestions(data.suggestions)
        }
      } else {
        // Fallback if API fails
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: "Sorry, I couldn't process that. Please try again!",
            sender: "other" as const,
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Connection error. Please try again.",
          sender: "other" as const,
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        },
      ])
    } finally {
      setIsAiThinking(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-stone-50">
      {/* Chat Header */}
      <div className="bg-white px-4 py-3 border-b flex items-center justify-between sticky top-0 shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="-ml-2">
            <ChevronLeft className="h-6 w-6 text-stone-600" />
          </Button>
          <div className="relative">
            <img
              src="/placeholder.svg?height=40&width=40"
              className="h-10 w-10 rounded-full border border-stone-100"
              alt="Tofu Owner"
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm">Tofu's Mom</h3>
            <span className="text-xs text-stone-500">{t.chat.activeNow}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5 text-stone-400" />
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className="flex justify-center my-4">
            <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1 rounded-full">{t.chat.today}</span>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.sender === "me"
                    ? "bg-orange-500 text-white rounded-br-none"
                    : "bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isAiThinking && (
            <div className="flex justify-start">
              <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {aiSuggestions.length > 0 && (
        <div className="px-4 py-3 bg-gradient-to-b from-indigo-50 to-purple-50 border-t border-indigo-100">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="flex items-center gap-1.5">
              <Bot className="h-4 w-4 text-indigo-600" />
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            </div>
            <span className="text-xs font-bold text-indigo-700">{t.chat.aiSuggestions}</span>
          </div>
          <div className="flex flex-col gap-2">
            {aiSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(suggestion)}
                className="w-full text-left bg-white text-stone-700 text-sm px-4 py-2.5 rounded-xl border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm active:scale-98"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-stone-200">
        <div className="flex gap-2 items-center bg-stone-100 rounded-full px-4 py-2 border border-transparent focus-within:border-orange-300 focus-within:bg-white transition-all">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend(inputText)}
            placeholder={t.chat.typeMessage}
            className="border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 h-auto placeholder:text-stone-400"
          />
          <Button
            onClick={() => handleSend(inputText)}
            size="icon"
            disabled={!inputText.trim()}
            className="h-8 w-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="h-4 w-4 ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
