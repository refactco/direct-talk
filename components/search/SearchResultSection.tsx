import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface SearchResultSectionProps {
  title: string
  viewAllHref?: string
  children: React.ReactNode
  className?: string
}

export function SearchResultSection({ title, viewAllHref, children, className = "" }: SearchResultSectionProps) {
  return (
    <section className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {viewAllHref && (
          <Button variant="link" asChild>
            <Link href={viewAllHref} className="text-sm text-muted-foreground">
              Show all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-4">{children}</div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}

