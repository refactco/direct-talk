"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Check, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useResourceContext } from "@/context/ResourceContext"
import { useToast } from "@/components/ui/use-toast"
import type { Resource } from "@/types/resource"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createPortal } from "react-dom"

interface ResourceDetailDrawerProps {
  resource: Resource | null
  isOpen: boolean
  onClose: () => void
}

const ResourceDetailDrawer: React.FC<ResourceDetailDrawerProps> = ({ resource, isOpen, onClose }) => {
  const [isAdded, setIsAdded] = useState(false)
  const { addResource, removeResource, selectedResources } = useResourceContext()
  const router = useRouter()
  const { toast } = useToast()
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (resource) {
      setIsAdded(selectedResources.some((r) => r.id === resource.id))
    }
  }, [resource, selectedResources])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleToggleResource = () => {
    if (!resource) return

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

  const handleStartChat = () => {
    if (resource) {
      if (!isAdded) {
        addResource(resource)
        setIsAdded(true)
        toast({
          description: "Added to Your Library.",
          duration: 2000,
          className: "w-auto",
        })
      }
      router.push("/chat")
    }
  }

  if (!isOpen || !resource) return null

  const drawerContent = (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-black shadow-lg z-50 overflow-y-auto"
      ref={drawerRef}
    >
      <div className="flex flex-col min-h-full">
        {/* Header */}
        <div className="flex items-center justify-end p-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-white bg-[#242424] rounded-full transition-colors hover:bg-gray-700"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-gray-400 hover:text-white bg-[#242424] rounded-full transition-colors hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="aspect-square relative w-full mb-6">
              <Image
                src={resource.image || "/placeholder.svg"}
                alt={resource.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">{resource.title}</h2>
            <p className="text-lg text-gray-400 mb-6">{resource.author}</p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mb-8">
              <Button onClick={handleStartChat} className="bg-[#4CAF50] text-black hover:bg-[#45a049] rounded-full">
                Start Session
              </Button>
              <Button
                onClick={handleToggleResource}
                className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
                  isAdded
                    ? "bg-[#4CAF50] text-white hover:bg-[#45a049]"
                    : "bg-[#1A1A1A] border border-[#333333] text-[#666666] hover:text-white hover:border-white"
                }`}
              >
                {isAdded ? <Check className="h-7 w-7 stroke-[2.5]" /> : <Plus className="h-7 w-7 stroke-[2.5]" />}
              </Button>
            </div>

            {/* About Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">About</h3>
              <p className="text-gray-400 leading-relaxed">{resource.summary}</p>
            </div>

            {/* Topics Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {resource.topics.map((topic, index) => (
                  <span key={index} className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-full text-sm">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Credits Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Credits</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">{resource.author}</p>
                    <p className="text-sm text-gray-400">Author</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          {drawerContent}
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default ResourceDetailDrawer

