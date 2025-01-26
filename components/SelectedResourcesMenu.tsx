import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useResourceContext } from "@/context/ResourceContext"
import Link from "next/link"
import Image from "next/image"

interface SelectedResourcesMenuProps {
  isOpen: boolean
  onClose: () => void
}

const SelectedResourcesMenu: React.FC<SelectedResourcesMenuProps> = ({ isOpen, onClose }) => {
  const { selectedResources, removeResource } = useResourceContext()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-[320px] bg-[#121212] rounded-lg shadow-2xl overflow-hidden z-50 border border-white/[0.12] backdrop-blur-xl"
          style={{ background: "linear-gradient(180deg, rgba(24, 24, 24, 0.9) 0%, rgba(18, 18, 18, 0.9) 100%)" }}
        >
          <div className="px-4 py-3 flex justify-between items-center">
            <h2 className="text-[15px] font-semibold text-white">Selected Resources</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-white/10 rounded-full">
              <X className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
          <ScrollArea className="max-h-[400px]">
            {selectedResources.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400">No resources selected</p>
            ) : (
              <div className="py-1">
                {selectedResources.map((resource) => (
                  <div key={resource.id} className="px-4 py-2 hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={resource.image || "/placeholder.svg"}
                          alt={resource.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] font-medium text-white truncate">{resource.title}</h3>
                        <p className="text-[12px] text-gray-400 truncate">{resource.author}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeResource(resource.id)}
                        className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 hover:bg-white/10 rounded-full"
                      >
                        <X className="h-3.5 w-3.5 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          {selectedResources.length > 0 && (
            <div className="p-3 border-t border-white/[0.08]">
              <Link href="/chat" passHref>
                <Button className="w-full bg-white hover:bg-white/90 text-black font-semibold text-[13px] h-9">
                  Start Chat
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SelectedResourcesMenu

