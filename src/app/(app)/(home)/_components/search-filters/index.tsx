"use client";

import { useTRPC } from "@/trpc/client";
import Categories from "./categories";
import SearchInput from "./search-input";
import { useSuspenseQuery } from "@tanstack/react-query";

const SearchFilters = () => {
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions()
  );

  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{
        backgroundColor: "#F5F5F5",
      }}
    >
      <SearchInput data={categories} />
      <div className="hidden lg:block">
        <Categories data={categories} />
      </div>
    </div>
  );
};

export default SearchFilters;

export const SearchFiltersSkeleton = () => {
  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{
        backgroundColor: "#F5F5F5",
      }}
    >
      <SearchInput data={[]} disabled />
      <div className="hidden lg:block">
        <div className="h-11" />
      </div>
    </div>
  );
};
