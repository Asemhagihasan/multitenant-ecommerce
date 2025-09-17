import { useEffect, useRef, useState } from "react";

import CategoryDropdown from "./category-dropdown";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import CategoriesSidebar from "./categories-sidebar";
import { CategoriesGetManyOutputSingle } from "@/modules/categories/types";
import { useParams } from "next/navigation";

interface Props {
  data: CategoriesGetManyOutputSingle[];
}

const Categories = ({ data }: Props) => {
  const params = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(data.length);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categoryParam = params.category as string;
  const activeCategory = categoryParam || "all";

  console.log("activeCategory", activeCategory);

  const activeCategoryIndex = data.findIndex(
    (category) => category.slug === activeCategory
  );

  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const claculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current)
        return;

      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = viewAllRef.current.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth;

      const items = Array.from(measureRef.current.children) as HTMLElement[];
      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        const width = item.getBoundingClientRect().width;

        if (totalWidth + width > availableWidth) {
          break;
        }

        totalWidth += width;
        visible++;

        setVisibleCount(visible);
      }
    };

    const resizeObserver = new ResizeObserver(claculateVisible);
    resizeObserver.observe(containerRef.current!);

    return () => resizeObserver.disconnect();
  }, [data.length]);

  return (
    <div className="relative w-full">
      <CategoriesSidebar
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        data={data}
      />
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-none: flex"
        style={{
          position: "fixed",
          top: -9999,
          left: -9999,
        }}
      >
        {data?.map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category?.slug}
              isNavigationHoverd={false}
            />
          </div>
        ))}
      </div>

      <div
        className="flex flex-nowrap items-center"
        ref={containerRef}
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        {data.slice(0, visibleCount).map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category?.slug}
              isNavigationHoverd={isAnyHovered}
            />
          </div>
        ))}
        <div ref={viewAllRef} className="shrink-0">
          <Button
            variant="elevated"
            className={cn(
              "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
              isActiveCategoryHidden &&
                !isAnyHovered &&
                "bg-white border-primary"
            )}
            onClick={() => setIsSidebarOpen(true)}
          >
            View all
            <ListFilterIcon className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Categories;
