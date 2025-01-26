"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Book, ChevronDown, ChevronUp, MessageSquare } from "lucide-react"
import { useResourceContext } from "@/context/ResourceContext"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function SelectedResourcesSummary() {
  const { selectedResources } = useResourceContext()
  const [isExpanded, setIsExpanded] = useState(true)

  if (selectedResources.length === 0) return null

  return (
    <div className="w-64 bg-[#0C0C0C] border-r border-white/[0.08] h-full flex flex-col">
      <div className="flex-1">
        <div className="px-3 py-4">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-white/90 hover:bg-white/[0.08] rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>Selected Resources</span>
            </div>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden px-3"
            >
              {selectedResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.08] transition-colors group"
                >
                  <div className="relative w-6 h-6 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={resource.image || "/placeholder.svg"}
                      alt={resource.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm text-white/90 truncate">{resource.title}</h3>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-3 border-t border-white/[0.08]">
        <Link href="/chat">
          <Button className="w-full bg-white hover:bg-white/90 text-black gap-2 h-9">
            <MessageSquare className="h-4 w-4" />
            Start Chat
          </Button>
        </Link>
      </div>
    </div>
  )
}

