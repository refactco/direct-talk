'use client';

import { DetailItemList } from '@/components/detail-item-list/detail-item-list';
import { getResourceEpisodes } from '@/lib/api';
import { IGetResourceEpisodesResponse } from '@/lib/api/api-type';
import { IResource } from '@/types/resources';
import { useEffect, useState } from 'react';
import { IDetailSheetResourceEpisodesProps } from './detail-sheet-resource-episodes-type';
import toastConfig from '@/lib/toast-config';
import { useToast } from '@/hooks/use-toast';

export function DetailSheetResourceEpisodes(
  props: IDetailSheetResourceEpisodesProps
) {
  const { resource } = props;
  const [isEpisodeLoading, setIsEpisodeLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [episodes, setEpisodes] = useState<IResource[]>([]);
  const [episodesInfo, setEpisodesInfo] =
    useState<Omit<IGetResourceEpisodesResponse, 'resources'>>();
  const { type, image_url, id } = resource;
  const { toast } = useToast();

  useEffect(() => {
    const fetchEpisodes = async () => {
      setIsEpisodeLoading(true);

      try {
        const { resources, ...rest } = await getResourceEpisodes({
          resourceId: id.toString()
        });

        // console.log({ fetchedEpisodes });

        setEpisodes(resources);
        setEpisodesInfo(rest);
      } catch (err) {
        const toastLimitConf: any = toastConfig({
          message:
            err instanceof Error ? err.message : 'Error fetching episodes',
          toastType: 'destructive'
        });
        toast(toastLimitConf);
      } finally {
        setIsEpisodeLoading(false);
      }
    };

    if (type === 'show') {
      fetchEpisodes();
    }
  }, [id]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setIsLoadingMore(true);

      try {
        const { resources, ...rest } = await getResourceEpisodes({
          resourceId: id.toString(),
          pageNum: currentPage
        });

        setEpisodes([...episodes, ...resources]);
        setEpisodesInfo(rest);
      } catch (err) {
        const toastLimitConf: any = toastConfig({
          message:
            err instanceof Error ? err.message : 'Error fetching episodes',
          toastType: 'destructive'
        });
        toast(toastLimitConf);
      } finally {
        setIsLoadingMore(false);
      }
    };

    fetchEpisodes();
  }, [currentPage]);

  if (type !== 'show') {
    return null;
  }

  return (
    <DetailItemList
      title="Episodes"
      alternativeImageSource={image_url}
      resources={episodes}
      isLoading={isEpisodeLoading}
      isLoadingMore={isLoadingMore}
      showLoadMore={(episodesInfo?.total ?? 0) > episodes.length}
      onLoadMoreClick={() => {
        setCurrentPage(currentPage + 1);
      }}
    />
  );
}
