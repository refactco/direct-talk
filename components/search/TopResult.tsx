import type { Resource } from "@/types/resources";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSelectedResources } from "@/contexts/SelectedResourcesContext";

export function TopResult({ resource }: { resource: Resource }) {
  const { addResource, isSelected } = useSelectedResources();
  return (
    <Link
      href={`/resources/${resource.id}`}
      className="group relative flex flex-col gap-4 rounded-md bg-background-highlight p-5 transition-colors hover:bg-background-secondary"
    >
      <div className="aspect-square w-48 overflow-hidden rounded-md">
        <img
          src={resource.imageUrl || "/placeholder.svg"}
          alt={resource.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <h3 className="text-3xl font-bold">{resource.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {resource.type} • {resource.authorId}
        </p>
      </div>
      <Button
        size="icon"
        className="absolute bottom-6 right-6 h-12 w-12 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => {
          e.preventDefault();
          addResource(resource);
        }}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </Link>
  );
}
