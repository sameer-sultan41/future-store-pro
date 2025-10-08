"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TFilters, TPageStatus, TFilterBrands } from "@/domains/shop/productList/types";
import { DEFAULT_FILTERS } from "@/domains/shop/productList/constants";
import { CloseIcon } from "@/shared/components/icons/svgIcons";
import { Button } from "@/components/ui/button";
import CheckBox from "@/shared/components/UI/checkBox";
import PriceSlider from "@/shared/components/UI/priceSlider";
import { SK_Box } from "@/shared/components/UI/skeleton";
import { cn } from "@/shared/utils/styling";
import { Label } from "@radix-ui/react-label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const Filters = () => {
  // Render
  return (
    <div className={cn("min-w-[260px]  border-r border-gray-300 pr-5 ")}>
      <div className="w-full lg:mt-0 my-4 border-b border-gray-300">
        <div className="flex justify-between mb-3.5">
          <h3 className="text-sm font-medium text-gray-800">Availability</h3>
        </div>
        <div className="w-full flex gap-2 px-2.5 mb-6 flex-col">
          <RadioGroup>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All</Label>
            </div>

            <div className="flex items-center gap-3">
              <RadioGroupItem value="inStock" id="inStock" />
              <Label htmlFor="inStock">In Stock</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="outStock" />
              <Label htmlFor="out">Out of Stock</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      <div className="w-full mb-4 border-b border-gray-300">
        <div className="flex justify-between mb-3.5">
          <h3 className="text-sm font-medium text-gray-800">Price</h3>
        </div>
        <div className="w-full flex gap-2 px-2.5 mb-6 flex-col">
          <div className="flex h-auto gap-3 text-sm text-gray-700 transition-[border] duration-300">
            <div>
              <Label className="block w-full mb-2">From</Label>
              <Slider defaultValue={[33]} max={100} step={1} />
              <Input type="number" value={0} />
            </div>
            <hr className="h-5 mt-[31px] border-r border-gray-300" />
            <div>
              <label className="block w-full mb-2">To</label>
              <Input type="number" value={100} />
            </div>
          </div>
          {/* <PriceSlider
            sliderValues={filters.priceMinMax}
            minMaxLimit={filters.priceMinMaxLimitation}
            pageStatus={pageStatus}
            onChange={(value) => onFilterChange({ ...filters, priceMinMax: [...value] })}
          /> */}
        </div>
      </div>
      <div className="w-full mb-4 border-b border-gray-300">
        <div className="flex justify-between mb-3.5">
          <h3 className="text-sm font-medium text-gray-800">Brands</h3>
        </div>
        <div className="w-full flex gap-2 px-2.5 mb-6 flex-col">
          <div className="w-full h-auto flex gap-2 flex-col">
            {/* {filters.brands.map((brand, index) => (
                <CheckBox
                  key={brand.id}
                  isChecked={brand.isSelected}
                  text={brand.name}
                  onClick={() => onBrandChange(index)}
                />
              ))} */}
          </div>
        </div>
      </div>
      <Button variant={"outline"}>Apply Changes</Button>
    </div>
    // </div>
  );
};

export default Filters;
