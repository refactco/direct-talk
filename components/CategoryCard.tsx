import Link from "next/link"
import { cn } from "@/lib/utils"

interface CategoryCardProps {
  id: string
  name: string
  color: string
  imageUrl: string
  className?: string
}

export function CategoryCard({ id, name, color, imageUrl, className }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${id}`}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-lg transition-all hover:scale-105",
        className,
      )}
      style={{ backgroundColor: color }}
    >
      <div className="p-4">
        <h3 className="text-xl font-bold text-white">{name}</h3>
      </div>
      <div className="absolute bottom-0 right-0 w-[100px] h-[100px] rotate-[25deg] translate-x-[18%] translate-y-[5%]">
        <img src={imageUrl || "/placeholder.svg"} alt="" className="w-full h-full object-cover rounded-lg shadow-lg" />
      </div>
    </Link>
  )
}

