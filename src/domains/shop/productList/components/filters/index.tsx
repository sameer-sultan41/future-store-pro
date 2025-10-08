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

const Filters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State for showing/hiding filter window
  const [showFilters, setShowFilters] = useState(false);
  // Main filter state
  const [filters, setFilters] = useState<TFilters>(DEFAULT_FILTERS);
  // Track applied filters for change detection
  const [appliedFilters, setAppliedFilters] = useState<TFilters>(DEFAULT_FILTERS);
  // Page status for controlling skeletons
  const [pageStatus, setPageStatus] = useState<TPageStatus>("filledProductList");

  // Initialize filters from URL on mount
  useEffect(() => {
    const stockStatus = searchParams.get("stockStatus") as TFilters["stockStatus"] | null;
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const brands = searchParams.get("brands");
    setFilters((prev) => ({
      ...prev,
      stockStatus: stockStatus || prev.stockStatus,
      priceMinMax: [
        priceMin ? Number(priceMin) : prev.priceMinMax[0],
        priceMax ? Number(priceMax) : prev.priceMinMax[1],
      ],
      brands: brands ? prev.brands.map((b) => ({ ...b, isSelected: brands.split(",").includes(b.id) })) : prev.brands,
    }));
    setAppliedFilters((prev) => ({
      ...prev,
      stockStatus: stockStatus || prev.stockStatus,
      priceMinMax: [
        priceMin ? Number(priceMin) : prev.priceMinMax[0],
        priceMax ? Number(priceMax) : prev.priceMinMax[1],
      ],
      brands: brands ? prev.brands.map((b) => ({ ...b, isSelected: brands.split(",").includes(b.id) })) : prev.brands,
    }));
    // Simulate loading, then set to filledProductList
    setPageStatus("pageLoading");
    const timer = setTimeout(() => setPageStatus("filledProductList"), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, []);

  // Helper: check if filters changed
  const isFilterChanged = JSON.stringify(filters) === JSON.stringify(appliedFilters);

  // Handlers
  const onToggleWindow = (val: boolean) => setShowFilters(val);
  const onFilterChange = (newFilters: TFilters) => setFilters(newFilters);
  const onBrandChange = (index: number) => {
    setFilters((prev) => {
      const brands = prev.brands.map((b, i) => (i === index ? { ...b, isSelected: !b.isSelected } : b));
      return { ...prev, brands };
    });
  };
  const onApplyFilter = () => {
    setAppliedFilters(filters);
    // Update search params
    const params = new URLSearchParams();
    params.set("stockStatus", filters.stockStatus);
    params.set("priceMin", String(filters.priceMinMax[0]));
    params.set("priceMax", String(filters.priceMinMax[1]));
    params.set(
      "brands",
      filters.brands
        .filter((b) => b.isSelected)
        .map((b) => b.id)
        .join(",")
    );
    router.replace(`${pathname}?${params.toString()}`);
    setShowFilters(false);
  };

  // Render
  return (
    <div className={cn("min-w-[260px]  border-r border-gray-300 pr-5 ")}>
      <div className="w-full lg:mt-0 my-4 border-b border-gray-300">
        <div className="flex justify-between mb-3.5">
          <h3 className="text-sm font-medium text-gray-800">Availability</h3>
        </div>
        <div className="w-full flex gap-2 px-2.5 mb-6 flex-col">
          <CheckBox
            text="All"
            onClick={() => onFilterChange({ ...filters, stockStatus: "all" })}
            isChecked={filters.stockStatus === "all"}
          />
          <CheckBox
            text="In Stock"
            onClick={() => onFilterChange({ ...filters, stockStatus: "inStock" })}
            isChecked={filters.stockStatus === "inStock"}
          />
          <CheckBox
            text="Out of Stock"
            onClick={() => onFilterChange({ ...filters, stockStatus: "outStock" })}
            isChecked={filters.stockStatus === "outStock"}
          />
        </div>
      </div>
      {/* <div className="w-full mb-4 border-b border-gray-300">
          <div className="flex justify-between mb-3.5">
            <h3 className="text-sm font-medium text-gray-800">Price</h3>
          </div>
          <div className="w-full flex gap-2 px-2.5 mb-6 flex-col">
            <PriceSlider
              sliderValues={filters.priceMinMax}
              minMaxLimit={filters.priceMinMaxLimitation}
              pageStatus={pageStatus}
              onChange={(value) => onFilterChange({ ...filters, priceMinMax: [...value] })}
            />
          </div>
        </div> */}
      {/* <div className="w-full mb-4 border-b border-gray-300">
          <div className="flex justify-between mb-3.5">
            <h3 className="text-sm font-medium text-gray-800">Brands</h3>
          </div>
          <div className="w-full flex gap-2 px-2.5 mb-6 flex-col">
            {pageStatus === "pageLoading" ? (
              <div className="flex flex-col gap-2">
                <SK_Box width="100%" height="20px" />
                <SK_Box width="100%" height="20px" />
                <SK_Box width="100%" height="20px" />
                <SK_Box width="100%" height="20px" />
                <SK_Box width="100%" height="20px" />
              </div>
            ) : pageStatus === "categoryHasNoProduct" ? (
              <div className="w-full h-auto flex flex-col" />
            ) : (
              <div className="w-full h-auto flex gap-2 flex-col">
                {filters.brands.map((brand, index) => (
                  <CheckBox
                    key={brand.id}
                    isChecked={brand.isSelected}
                    text={brand.name}
                    onClick={() => onBrandChange(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div> */}
      <Button
        disabled={isFilterChanged}
        className="w-full py-1 text-sm rounded-md text-gray-100 border-none bg-future-blue-500 hover:bg-future-blue-600 active:bg-future-blue-400 disabled:bg-future-blue-700"
        onClick={onApplyFilter}
      >
        Apply Changes
      </Button>
    </div>
    // </div>
  );
};

export default Filters;
