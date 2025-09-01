import { useInfiniteQuery } from "react-query";
import { PropertySearchCriteria, PropertySearchResponse } from "@/core/types/Property";
import { propertyService } from "@/core/services/implementations/PropertyService";

const PAGE_SIZE = 20;

export const useInfiniteProperties = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = useInfiniteQuery(
    ["properties", "infinite"],
    async ({ pageParam = 1 }) => {
      const searchCriteria: PropertySearchCriteria = {
        page: pageParam,
        pageSize: PAGE_SIZE,
        // Vous pouvez ajouter d'autres critères de recherche ici
        // location: "Douala",
        // guests: 2,
        // etc.
      };

      return await propertyService.searchProperties(searchCriteria);
    },
    {
      getNextPageParam: (lastPage: PropertySearchResponse, allPages: PropertySearchResponse[]) => {
        if (lastPage.totalPages <= allPages.length) {
          return undefined; // Plus de pages
        }
        return allPages.length + 1; // Page suivante
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes (cacheTime au lieu de gcTime pour v3)
    }
  );

  // Extraire toutes les propriétés de toutes les pages
  const properties = data?.pages.flatMap((page: PropertySearchResponse) => page.properties) || [];

  return {
    properties,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
    // Métadonnées utiles
    totalCount: data?.pages[0]?.totalCount || 0,
    totalPages: data?.pages[0]?.totalPages || 0,
    currentPage: data?.pages.length || 0,
  };
};
