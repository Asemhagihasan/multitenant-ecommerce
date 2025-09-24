import type { SearchParams } from "nuqs/server";

import { trpc, getQueryClient, HydrateClient } from "@/trpc/server";

import { loadProductFilters } from "@/modules/products/search-params";
import ProductListView from "@/modules/products/ui/view/product-list-view";
import { DEFAULT_LIMIT } from "@/constants";

interface Porps {
  searchParams: Promise<SearchParams>;
}

const HomePage = async ({ searchParams }: Porps) => {
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrateClient>
      <ProductListView />
    </HydrateClient>
  );
};

export default HomePage;
