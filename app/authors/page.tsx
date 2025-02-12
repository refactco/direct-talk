import { PeopleCard } from "@/components/PeopleCard";
import { getAuthors } from "@/lib/api";

export default async function AllAuthorsPage() {
  try {
    const authors = await getAuthors();

    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">All Authors</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {authors.map((author) => (
            <PeopleCard key={author.id} people={author} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return <></>;
  }
}
