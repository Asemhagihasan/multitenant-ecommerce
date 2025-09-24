import type { SearchParams } from "nuqs/server";

import { trpc, getQueryClient, HydrateClient } from "@/trpc/server";

import { loadProductFilters } from "@/modules/products/search-params";
import ProductListView from "@/modules/products/ui/view/product-list-view";

interface Porps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<SearchParams>;
}

const CategoryPage = async ({ params, searchParams }: Porps) => {
  const { category } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category,
      ...filters,
    })
  );

  return (
    <HydrateClient>
      <ProductListView category={category} />
    </HydrateClient>
  );
};

export default CategoryPage;
