"use client";
import { Button } from "@/components/ui/button";
import { sortDropdownData } from "@/domains/shop/productList/constants";
import { TDropDown } from "@/shared/types/uiElements";

type TProps = {
  data: TDropDown[];
  selectedId: number;
  onChange: (newIndex: number) => void;
};

const LineList = () => {
  return (
    <div className="w-full flex gap-2 items-center h-8">
      {sortDropdownData.map((item, index) => (
        <Button
          variant={"secondary"}
          key={index}
          // className={cn(
          //   "inline-block text-sm transition-colors duration-300 px-4 py-1 rounded-full",
          //   selectedId === index
          //     ? "text-white cursor-default font-medium bg-gray-900 hover:bg-gray-900"
          //     : "cursor-pointer text-gray-500 hover:bg-gray-200"
          // )}
        >
          {item.text}
        </Button>
      ))}
    </div>
  );
};

export default LineList;
