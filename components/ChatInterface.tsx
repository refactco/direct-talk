"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import SelectedResourcesSummary from "./SelectedResourcesSummary"
import { useResourceContext } from "@/context/ResourceContext"
import { sendChatMessage } from "@/services/api"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Image, FileText, PenLine, ListTodo, MoreHorizontal, Mic, Send } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  citation?: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { selectedResources } = useResourceContext()
  const { toast } = useToast()

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
    }

    setMessages((prevMessages) => [...prevMessages, newUserMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await sendChatMessage(
        inputMessage,
        selectedResources.map((r) => r.id),
      )

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: "ai",
        citation: response.citation,
      }

      setMessages((prevMessages) => [...prevMessages, aiResponse])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <SelectedResourcesSummary />
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-grow px-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <h1 className="text-2xl font-semibold text-white/80">
                What would you like to know about the selected resources?
              </h1>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-4 ${message.sender === "user" ? "text-right" : "text-left"}`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg max-w-[80%] ${
                      message.sender === "user" ? "bg-blue-600 text-white" : "bg-[#2A2A2A] text-white/90"
                    }`}
                  >
                    {message.text}
                  </div>
                  {message.citation && <div className="text-sm text-gray-400 mt-1 pl-2">{message.citation}</div>}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </ScrollArea>

        <div className="px-4 py-4">
          <div className="relative">
            <div className="relative flex items-center bg-[#2A2A2A] rounded-xl">
              <div className="flex-1 flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSendMessage()
                  }}
                  placeholder="Message ChatGPT"
                  className="w-full px-4 py-3 bg-transparent border-none text-white placeholder:text-gray-400 focus:outline-none text-sm"
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center gap-2 pr-2">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10">
                  <Mic className="h-5 w-5" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="absolute left-0 right-0 -bottom-16 px-1">
              <div className="flex items-center justify-start gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs bg-[#2A2A2A] text-gray-300 hover:text-white gap-2 rounded-lg"
                >
                  <Image className="h-4 w-4" />
                  Create image
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs bg-[#2A2A2A] text-gray-300 hover:text-white gap-2 rounded-lg"
                >
                  <FileText className="h-4 w-4" />
                  Summarize text
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs bg-[#2A2A2A] text-gray-300 hover:text-white gap-2 rounded-lg"
                >
                  <PenLine className="h-4 w-4" />
                  Help me write
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs bg-[#2A2A2A] text-gray-300 hover:text-white gap-2 rounded-lg"
                >
                  <ListTodo className="h-4 w-4" />
                  Make a plan
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs bg-[#2A2A2A] text-gray-300 hover:text-white gap-2 rounded-lg"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

