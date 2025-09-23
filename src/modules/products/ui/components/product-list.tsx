"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Porps {
  category?: string;
}

export const ProductList = ({ category }: Porps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({ category })
  );
  return <div>{JSON.stringify(data)}</div>;
};

export const ProductListSkeleton = () => {
  return <div>Loading...</div>;
};
