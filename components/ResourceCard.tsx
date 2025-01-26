"use client"

import { useState } from "react"
import type { Resource } from "@/types/resource"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useResourceContext } from "@/context/ResourceContext"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface ResourceCardProps {
  resource: Resource
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { addResource, removeResource, selectedResources } = useResourceContext()
  const [isAdded, setIsAdded] = useState(() => selectedResources.some((r) => r.id === resource.id))

  const handleToggleResource = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isAdded) {
      removeResource(resource.id)
      setIsAdded(false)
      toast({
        description: "Removed from Your Session.",
        duration: 2000,
        className: "w-auto",
      })
    } else {
      addResource(resource)
      setIsAdded(true)
      toast({
        description: "Added to Your Session.",
        duration: 2000,
        className: "w-auto",
      })
    }
  }

  const handleStartSession = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAdded) {
      addResource(resource)
      setIsAdded(true)
      toast({
        description: "Added to Your Session.",
        duration: 2000,
        className: "w-auto",
      })
    }
    router.push("/chat")
  }

  return (
    <div className="flex items-start gap-6 p-6 bg-[#2A2A2A] rounded-2xl">
      <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
        <Image src={resource.image || "/placeholder.svg"} alt={resource.title} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-semibold text-white mb-1">{resource.title}</h3>
        <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">{resource.author}</p>
        <p className="text-gray-300 text-sm mb-3">{resource.summary}</p>
        <div className="flex flex-wrap gap-2">
          {resource.topics.map((topic, index) => (
            <span key={index} className="inline-flex px-3 py-1 rounded-full text-xs text-gray-300 bg-[#1A1A1A]">
              {topic}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Button onClick={handleToggleResource} className="bg-[#4CAF50] hover:bg-[#45a049] text-black font-medium px-6">
          Add Resource
        </Button>
        <Button onClick={handleStartSession} variant="ghost" className="text-gray-400 hover:text-white px-0">
          Start Session
        </Button>
      </div>
    </div>
  )
}

