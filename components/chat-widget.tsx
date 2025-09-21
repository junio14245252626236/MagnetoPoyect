"use client"

import React, { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Minimize2 } from "lucide-react"
import { Star } from "lucide-react"

// Definición del tipo Message
type Message = {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  // Estado de mensajes y otros
  const [messages, setMessages] = useState<Message[]>(
    [
      {
        id: "1",
        text: "¡Hola! Soy el asistente virtual de Magneto365. ¿En qué puedo ayudarte hoy?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]
  )
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [rating, setRating] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const isAuthed = !!session

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Actualizar handleSendMessage para usar Message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage]);
    const sendingText = inputValue;
    setInputValue("");
    setIsTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: sendingText, 
          threadId, 
          rating: rating > 0 ? rating : undefined,
          company: "EAFIT" // Por ahora usando EAFIT como empresa default
        }),
      });
      if (!res.ok) throw new Error("Error de chat");
      const data = await res.json();
      if (!threadId && data.threadId) setThreadId(data.threadId);
      // Append bot message from server
      const botMsgs = (data.messages || []).filter((m: any) => m.sender === "bot");
      if (botMsgs.length > 0) {
        setMessages((prev) => [
          ...prev,
          ...botMsgs.map((m: any) => ({ id: m.id, text: m.text, sender: "bot" as const, timestamp: new Date(m.createdAt) })),
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 2).toString(), text: "Ocurrió un error, intenta nuevamente.", sender: "bot", timestamp: new Date() },
      ]);
    } finally {
      setIsTyping(false);
      setRating(0);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
          isMinimized ? "w-80 h-16" : "w-80 h-96"
        }`}
      >
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">M</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Asistente Magneto365</h3>
              <p className="text-xs opacity-90">En línea</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-blue-700"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-4">
              {!isAuthed ? (
                <div className="text-center text-sm text-gray-600">
                  Debes iniciar sesión para usar el chat.
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))
              )}

              {isTyping && isAuthed && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
              {!isAuthed ? (
                <div className="flex flex-col gap-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => {
                    window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
                  }}>
                    Iniciar sesión para chatear
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  {/* Rating selector for feedback */}
                  <div className="flex items-center space-x-1 mb-2">
                    <span className="text-sm text-gray-600">Califica la empresa:</span>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button key={i} type="button" onClick={() => setRating(i)}>
                        <Star className={`h-5 w-5 ${i <= rating ? "text-yellow-400" : "text-gray-300"}`} />
                      </button>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu mensaje..."
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="icon" className="bg-blue-600 hover:bg-blue-700" disabled={!inputValue.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
