"use client";

import { Button } from "@/components/ui/button";
import { useSelectedResources } from "@/contexts/SelectedResourcesContext";
import { formatDate } from "@/lib/utils";
import type { IResource } from "@/types/resources";
import { Check, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";

type ResourceContentProps = {
  resource: IResource;
  relatedResources: IResource[];
};

export function ResourceContent({
  resource,
  relatedResources
}: ResourceContentProps) {
  const { addResource, removeResource, isSelected } = useSelectedResources();

  return (
    <>
      <div className="flex flex-1 gap-8 p-6">
        <div className="flex-1 space-y-6">
          {/* Content Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Content</h2>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-4">
              {resource.content && (
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-10 w-10"
                        onClick={() =>
                          isSelected(resource.id)
                            ? removeResource(resource.id)
                            : addResource(resource)
                        }
                      >
                        {isSelected(resource.id) ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Plus className="h-5 w-5" />
                        )}
                      </Button>
                      <div>
                        <div className="font-medium">Chapter 1</div>
                        <div className="text-sm text-muted-foreground">
                          Introduction
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(resource.publishedAt)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">About</h2>
            <p className="text-muted-foreground">{resource.description}</p>
            <div className="flex gap-2">
              {resource.topics.map((topic) => (
                <Link
                  key={topic}
                  href={`/topics/${topic}`}
                  className="rounded-full bg-background-highlight px-3 py-1 text-sm hover:bg-background-secondary"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Related Resources */}
        <div className="w-80 flex-shrink-0 space-y-6">
          <h2 className="text-2xl font-bold">Related Resources</h2>
          <div className="space-y-4">
            {relatedResources.slice(0, 5).map((relatedResource) => (
              <Link
                key={relatedResource.id}
                href={`/resources/${relatedResource.id}`}
                className="flex items-center gap-4 rounded-md p-2 transition-colors hover:bg-background-highlight"
              >
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                  <img
                    src={relatedResource.imageUrl || "/placeholder.svg"}
                    alt={relatedResource.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{relatedResource.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {relatedResource.type}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
