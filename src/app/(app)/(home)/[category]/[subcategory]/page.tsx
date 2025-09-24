import { loadProductFilters } from "@/modules/products/search-params";
import ProductListView from "@/modules/products/ui/view/product-list-view";
import { trpc, getQueryClient, HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs/server";

interface Porps {
  params: Promise<{
    subcategory: string;
  }>;
  searchParams: Promise<SearchParams>;
}

const SubCategoryPage = async ({ params, searchParams }: Porps) => {
  const { subcategory } = await params;
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category: subcategory,
      ...filters,
    })
  );

  return (
    <HydrateClient>
      <ProductListView category={subcategory} />
    </HydrateClient>
  );
};

export default SubCategoryPage;
