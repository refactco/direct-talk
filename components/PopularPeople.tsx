/**
 * PopularPeople Component
 *
 * This component displays a horizontal scrollable list of popular people or authors.
 * It's typically used on the home page to showcase notable contributors.
 *
 * Props:
 * - people: An array of Resource objects representing popular people
 */
import Link from "next/link"
import Image from "next/image"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import type { Resource } from "@/types/resource"

interface PopularPeopleProps {
  people: Resource[]
  onResourceSelect: (resource: Resource) => void
}

export default function PopularPeople({ people, onResourceSelect }: PopularPeopleProps) {
  // Early return if no people are provided
  if (!people || people.length === 0) {
    return null
  }

  // Render popular people section
  return (
    <ScrollArea>
      <div className="flex space-x-6">
        {people.map((person) => (
          <div key={person.id} className="space-y-3 w-[150px] shrink-0" onClick={() => onResourceSelect(person)}>
            <div className="aspect-square relative overflow-hidden rounded-full">
              <Image
                src={person.image || "/placeholder.svg"}
                alt={person.author}
                fill
                className="object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="text-center">
              <h3 className="font-semibold truncate">{person.author}</h3>
              <p className="text-sm text-gray-400">{person.type}</p>
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

