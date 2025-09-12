import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategoriesGetManyOutputSingle } from "@/modules/categories/types";

interface Porps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  data: CategoriesGetManyOutputSingle[];
}

const CategoriesSidebar = ({ isOpen, onOpenChange, data }: Porps) => {
  const router = useRouter();
  const [parentCategories, setParentCategories] = useState<
    CategoriesGetManyOutputSingle[] | null
  >(null);

  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesGetManyOutputSingle | null>();

  // If we have parent categories show those, otherwise show categories
  const currentCategories = parentCategories || data || [];

  const handleOpenChange = (isOpen: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(isOpen);
  };

  const handleCategory = (category: CategoriesGetManyOutputSingle) => {
    if (category.subCategories && category.subCategories.length > 0) {
      setParentCategories(
        category.subCategories as CategoriesGetManyOutputSingle[]
      );
      setSelectedCategory(category);
    } else {
      if (parentCategories && selectedCategory) {
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        if (category.slug == "all") {
          router.push(`/`);
        } else {
          router.push(`/${category.slug}`);
        }
      }
      handleOpenChange(false);
    }
  };

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };

  const backgroundColor = selectedCategory?.color || "white";

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none"
        style={{ backgroundColor }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {parentCategories && (
            <button
              onClick={handleBackClick}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
            >
              <ChevronLeftIcon className="size-4 mr-2 " />
              Back
            </button>
          )}

          {currentCategories.map((category) => (
            <button
              onClick={() => handleCategory(category)}
              key={category.slug}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium cursor-pointer"
            >
              {category.name}
              {category?.subCategories &&
                category?.subCategories?.length > 0 && (
                  <ChevronRightIcon className="size-4" />
                )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CategoriesSidebar;
