"use client";

import { useTRPC } from "@/trpc/client";
import Categories from "./categories";
import SearchInput from "./search-input";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useParams } from "next/navigation";
import { DEFAULT_BG_COLOR } from "@/modules/home/constants";
import BreadcrumbNavigation from "./breadcrumbbs-navigation";

const SearchFilters = () => {
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions()
  );
  const params = useParams();

  const categoryParam = params.category as string;
  const activeCategory = categoryParam || "all";

  const activeCategoryData = categories.find((category) => {
    return category.slug === activeCategory;
  });

  const activeCategoryColor = activeCategoryData?.color || DEFAULT_BG_COLOR;
  const activeCategoryName = activeCategoryData?.name || null;

  const activeSubCategory = params.subcategory as string;
  const activeSubCategoryName =
    activeCategoryData?.subCategories?.find((subCategory) => {
      return subCategory.slug === activeSubCategory;
    })?.name || null;

  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{
        backgroundColor: activeCategoryColor,
      }}
    >
      <SearchInput data={categories} />
      <div className="hidden lg:block">
        <Categories data={categories} />
      </div>
      <BreadcrumbNavigation
        activeCategoryName={activeCategoryName}
        activeCategory={activeCategory}
        activeSubCategoryName={activeSubCategoryName}
      />
    </div>
  );
};

export default SearchFilters;

export const SearchFiltersSkeleton = () => {
  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{
        backgroundColor: DEFAULT_BG_COLOR,
      }}
    >
      <SearchInput data={[]} disabled />
      <div className="hidden lg:block">
        <div className="h-11" />
      </div>
    </div>
  );
};
