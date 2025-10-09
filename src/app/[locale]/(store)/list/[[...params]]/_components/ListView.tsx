"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getBrandsByCategory, getList, getProductsByCategory } from "@/actions/list/listServices";
import ProductCard from "@/app/[locale]/(store)/(home)/_components/TopProductCard";
import { ProductListSkeleton } from "@/domains/shop/productList/components";
import Filters from "@/domains/shop/productList/components/filters";
import NoItem from "@/domains/shop/productList/components/noItem";
import { DEFAULT_FILTERS, SORT_DATA, sortDropdownData } from "@/domains/shop/productList/constants";
import { TFilterBrands, TFilters, TListItem } from "@/domains/shop/productList/types";
import { TPageStatus } from "@/domains/shop/productList/types";
import { getFiltersFromProductList } from "@/domains/shop/productList/utils";
import { Button } from "@/components/ui/button";
import DropDownList from "@/shared/components/UI/dropDown";
import LineList from "@/shared/components/UI/lineList";
import { IMAGE_BASE_URL } from "@/shared/constants/store";
import { TProductPath } from "@/shared/types/product";
import { cn } from "@/shared/utils/styling";

const ListPage = () => {
  const router = useRouter();
  const { params } = useParams<{ params: string[] }>();
  const pathName = usePathname();

  console.log("pathName", pathName);

  const [productList, setProductList] = useState<TListItem[]>([]);
  const [subCategories, setSubCategories] = useState<TProductPath[]>([]);

  const [sortIndex, setSortIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [filters, setFilters] = useState<TFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<TFilters>({
    ...DEFAULT_FILTERS,
    priceMinMax: [...DEFAULT_FILTERS.priceMinMax],
  });

  const [isListLoading, setIsListLoading] = useState(true);

  useEffect(() => {
    const getProductsList = async () => {
      setIsListLoading(true);

      // const response = await getProductsByCategory("electronics/smartphones", "en");
      const response = await getProductsByCategory(
        pathName,
        "en"
        // { sortName: "name", sortType: "asc" },
        // "",
        // "all",
        // 0,
        // 1000,
        // ["b497558c-26f2-4f08-805a-8f96b3e9f717"]
      );

      // Accepts both {res: [...]} and {products: [...], subCategories: [...]}
      let products: any[] = Array.isArray(response.res) ? response.res : [];
      // Map products to TListItem structure
      const mappedProducts = products.map((product) => {
        const t = product.translation;
        return {
          id: product.id,
          name: t?.name || product.name || "",
          isAvailable: product.is_available,
          specialFeatures: t?.special_features || product.special_features || [],
          images: product.images || [],
          price: product.base_price,
          salePrice: product.salePrice ?? null,
          brand: product.brand || { id: "", name: "" },
        };
      });
      // Subcategories fallback (not used in UI but kept for future)
      let subCats: any[] = [];
      if (Array.isArray(response.subCategories)) {
        subCats = response.subCategories;
      }
      if (response.error || !Array.isArray(mappedProducts)) {
        router.push("/");
        return;
      }
      if (isFilterApplied) {
        setFilters(appliedFilters);
        setProductList(mappedProducts);
      } else {
        const filtersFromDB = getFiltersFromProductList(mappedProducts);
        setFilters(filtersFromDB);
        setSubCategories(subCats);
        setProductList(mappedProducts);
      }
      setIsListLoading(false);
    };

    getProductsList();
  }, [router, pathName, sortIndex, appliedFilters, isFilterApplied]);

  if (!params || !params.length) router.push("/");

  const handleSortChange = (newIndex: number) => {
    setSortIndex(newIndex);
  };

  const toggleFiltersWindow = (visibility: boolean) => {
    setShowFilters(visibility);
    if (visibility) {
      document.documentElement.classList.add("noScroll");
    } else {
      document.documentElement.classList.remove("noScroll");
    }
  };

  const getPageHeader = () => {
    const pageName = params[params.length - 1].split("-");
    pageName.forEach((word, index) => {
      pageName[index] = word[0].toUpperCase() + word.slice(1);
    });

    return pageName.join(" ");
  };

  const getLink = (array: string[], index: number) => {
    let link = "/list";
    for (let i = 0; i <= index; i++) {
      link += "/" + array[i];
    }
    return link;
  };

  const handleBrandChange = (index: number) => {
    const newBrandList = JSON.parse(JSON.stringify(filters.brands));
    newBrandList[index].isSelected = !newBrandList[index].isSelected;
    setFilters({ ...filters, brands: newBrandList });
  };

  const defineFilterChangeStatus = () => {
    if (appliedFilters.stockStatus !== filters.stockStatus) return false;

    if (JSON.stringify(appliedFilters.brands) !== JSON.stringify(filters.brands)) return false;

    if (JSON.stringify(appliedFilters.priceMinMax) !== JSON.stringify(filters.priceMinMax)) return false;

    return true;
  };
  const isFilterChanged: boolean = defineFilterChangeStatus();
  const handleApplyFilter = () => {
    const newFilter: TFilters = {
      brands: JSON.parse(JSON.stringify(filters.brands)),
      priceMinMax: [...filters.priceMinMax],
      stockStatus: filters.stockStatus,
      priceMinMaxLimitation: [...filters.priceMinMaxLimitation],
    };
    setIsFilterApplied(true);
    setAppliedFilters(newFilter);
  };

  const handleResetFilters = () => {
    const newBrands: TFilterBrands[] = [];
    filters.brands.forEach((b) => newBrands.push({ id: b.id, name: b.name, isSelected: true }));
    const newFilter: TFilters = {
      brands: newBrands,
      priceMinMax: [...filters.priceMinMaxLimitation],
      stockStatus: "all",
      priceMinMaxLimitation: [...filters.priceMinMaxLimitation],
    };
    setIsFilterApplied(false);
    setAppliedFilters(newFilter);
  };

  const getPageStatus = (): TPageStatus => {
    if (isListLoading) {
      if (isFilterApplied) return "filterLoading";
      return "pageLoading";
    }

    if (productList.length > 0) return "filledProductList";

    if (isFilterApplied) return "filterHasNoProduct";

    return "categoryHasNoProduct";
  };
  const currentPageStatus: TPageStatus = getPageStatus();

  const pageStatusJSX = {
    pageLoading: (
      <div className="flex flex-wrap gap-4 mt-7 ml-2 mb-[400px]">
        <ProductListSkeleton />
      </div>
    ),
    filterLoading: (
      <div className="flex flex-wrap gap-4 mt-7 ml-2 mb-[400px]">
        <ProductListSkeleton />
      </div>
    ),
    filledProductList: (
      <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-2 mb-14">
        {productList.map((product) => (
          <ProductCard
            key={product.id}
            imgUrl={[product.images?.[0], product.images?.[1]]}
            name={product.name}
            price={product.price}
            isAvailable={product.isAvailable}
            dealPrice={product.salePrice ?? undefined}
            specs={product.specialFeatures}
            url={"/product/" + product.id}
          />
        ))}
      </div>
    ),
    categoryHasNoProduct: <NoItem pageHeader={getPageHeader()} />,
    filterHasNoProduct: (
      <div className="flex flex-col items-center justify-center text-sm min-h-[400px] gap-4">
        <span> There is no product!</span>
        <Button onClick={handleResetFilters} className="w-[200px]">
          Reset Filters
        </Button>
      </div>
    ),
  }[currentPageStatus];

  return <>{pageStatusJSX}</>;
};

export default ListPage;
