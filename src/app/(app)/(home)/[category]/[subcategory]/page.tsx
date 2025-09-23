import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/components/product-list";
import { trpc, getQueryClient, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";

interface Porps {
  params: Promise<{
    subcategory: string;
  }>;
}

const SubCategoryPage = async ({ params }: Porps) => {
  const { subcategory } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category: subcategory,
    })
  );

  return (
    <HydrateClient>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={subcategory} />
      </Suspense>
    </HydrateClient>
  );
};

export default SubCategoryPage;
