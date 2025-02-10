import type { Author } from "@/types/resources";
import Image from "next/image";
import { UserIcon } from "@/components/icons/UserIcon";

interface PeopleCardProps {
  people: Author;
}

function PeopleCard({ people }: PeopleCardProps) {
  return (
    <div className="group relative w-32 aspect-square cursor-pointer px-2">
      <div className="relative w-full aspect-square rounded-full overflow-hidden bg-accent">
        {people.image_url ? (
          <Image
            src={people.image_url || "/placeholder.svg"}
            alt={people.name}
            fill
            className="object-cover transition-all duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-accent">
            <UserIcon className="fill-muted-foreground" />
          </div>
        )}
      </div>
      <div className="mt-2">
        <h3 className="text-sm text-foreground font-semibold">{people.name}</h3>
      </div>
    </div>
  );
}

export default PeopleCard;
