import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/components/product-list";
import { trpc, getQueryClient, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";

interface Porps {
  params: Promise<{
    category: string;
  }>;
}

const CategoryPage = async ({ params }: Porps) => {
  const { category } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category,
    })
  );

  return (
    <HydrateClient>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={category} />
      </Suspense>
    </HydrateClient>
  );
};

export default CategoryPage;
