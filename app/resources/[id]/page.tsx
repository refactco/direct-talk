import { ResourceCard } from '@/components/resource-card/ResourceCard';
import { ResourceContent } from '@/components/ResourceContent';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getResource, getResources } from '@/lib/api';

export default async function ResourcePage({
  params
}: {
  params: { id: string };
}) {
  const resource = await getResource(params.id);
  const relatedResources = await getResources();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div
        className="relative flex items-end p-6 bg-gradient-to-b from-background-highlight to-background"
        style={{ minHeight: '30vh' }}
      >
        <div className="flex items-end gap-6">
          <div className="h-48 w-48 flex-shrink-0 overflow-hidden rounded-md shadow-lg">
            <img
              src={resource.imageUrl || '/placeholder.svg'}
              alt={resource.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-2 pb-2">
            <div className="text-sm font-medium uppercase text-muted-foreground">
              {resource.type}
            </div>
            <h1 className="text-4xl font-bold">{resource.title}</h1>
            <div className="text-lg text-muted-foreground">
              By {resource.authorId}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ResourceContent
        resource={resource}
        relatedResources={relatedResources}
      />

      {/* Popular Resources */}
      <div className="border-t">
        <div className="p-6">
          <h2 className="mb-4 text-2xl font-bold">Popular Resources</h2>
          <ScrollArea className="w-full">
            <div className="flex gap-4">
              {relatedResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
