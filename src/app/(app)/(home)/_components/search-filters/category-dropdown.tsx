import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Category } from "@/payload-types";

import { Button } from "@/components/ui/button";
import { useDropdownPosition } from "./use-dropdown-position";
import SubCategoryMenu from "./subcategory-menu";

interface Props {
  category: Category;
  isActive: boolean;
  isNavigationHoverd: boolean;
}

const CategoryDropdown = ({
  category,
  isActive,
  isNavigationHoverd,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown
  const { getDropDownPosition } = useDropdownPosition(dropdownRef);

  const onMouseEnter = () => {
    if (category?.subCategories) {
      setIsOpen(true);
    }
  };

  const onMouseLeave = () => {
    setIsOpen(false);
  };

  const dropdownPosition = getDropDownPosition();

  return (
    <div
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative"
    >
      <div className="relative">
        <Button
          className={cn(
            "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
            isActive && !isNavigationHoverd && "bg-white border-primary"
          )}
          variant="elevated"
        >
          {category.name}
        </Button>

        {category?.subCategories && category?.subCategories?.length > 0 && (
          <div
            className={cn(
              "opacity-0 absolute -bottom-3 w-3 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2",
              isOpen && "opacity-100"
            )}
          />
        )}
      </div>
      <SubCategoryMenu
        category={category}
        isOpen={isOpen}
        position={dropdownPosition}
      />
    </div>
  );
};

export default CategoryDropdown;
