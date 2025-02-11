import { ResourceCard } from "@/components/resource-card/ResourceCard";
import { getResources } from "@/lib/api";

export default async function PopularResourcesPage() {
  try {
    const { resources } = await getResources({ sort: "popular" });

    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Popular Resources</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return <></>;
  }
}
