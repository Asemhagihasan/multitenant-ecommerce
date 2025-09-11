import { Input } from "@/components/ui/input";
import { ListFilterIcon, SearchIcon } from "lucide-react";
import { CustomCategory } from "../../types";
import CategoriesSidebar from "./categories-sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  disabled?: boolean;
  data: CustomCategory[];
}

const SearchInput = ({ disabled, data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar data={data} onOpenChange={setIsOpen} isOpen={isOpen} />
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <Input
          disabled={disabled}
          className="pl-10"
          placeholder="Search products"
        />
      </div>
      <Button
        variant="elevated"
        className="size-12 shrink-0 flex lg:hidden"
        onClick={() => setIsOpen(true)}
      >
        <ListFilterIcon />
      </Button>
    </div>
  );
};

export default SearchInput;
