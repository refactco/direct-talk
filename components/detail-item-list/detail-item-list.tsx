import { IResource } from "@/types/resources";
import { DetailItem } from "../detail-item/detail-item";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { IDetailItemListProps } from "./detail-item-list-type";

export function DetailItemList(props: IDetailItemListProps) {
  const {
    isLoading = false,
    isLoadingMore = false,
    resources,
    showLoadMore = false,
    alternativeImageSource,
    title,
    onLoadMoreClick
  } = props;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <h4 className="text-base font-semibold">{title}</h4>
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
      </div>
    );
  }

  if (resources.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-base font-semibold">{title}</h4>
      {resources.map((resource: IResource, resourceIndex: number) => {
        return (
          <DetailItem
            key={resourceIndex}
            alternativeImageSource={alternativeImageSource}
            resource={resource}
            onAddClick={() => {}}
            onClick={() => {}}
          />
        );
      })}
      {showLoadMore ? (
        <Button
          className="bg-accent text-white hover:bg-accent/90"
          size="sm"
          onClick={() => {
            onLoadMoreClick?.();
          }}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? "Loading..." : "Load More"}
        </Button>
      ) : null}
    </div>
  );
}
