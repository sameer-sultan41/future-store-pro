import React from "react";
import { getProductsByCategory } from "@/actions/list/listServices";
import TopProductCard from "../../(home)/_components/TopProductCard";
import NoResultImage from "./_components/NoResultImage";
import { getCurrencyFromCookie } from "@/actions/server";
import { getConvertedPrice } from "@/shared/utils/helper";
import { Urls } from "@/shared/constants/urls";

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; params?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { params: pathParams = [], locale } = await params;
  const { availability, minPrice, maxPrice, brand, sortName, sortType, search } = await searchParams;

  const pathName = Array.isArray(pathParams) ? pathParams.join("/") : "";

  const response = await getProductsByCategory({
    categoryIdOrUrl: pathName,
    languageCode: locale,
    sort: {
      sortName: (["price", "date", "name"].includes(String(sortName)) ? sortName : "date") as "price" | "date" | "name",
      sortType: (sortType === "asc" || sortType === "desc" ? sortType : "desc") as "asc" | "desc",
    },
    search: search ? String(search) : "",
    stockFilter: availability as "all" | "inStock" | "outStock",
    minPrice: minPrice !== undefined && minPrice !== "" ? Number(minPrice) : undefined,
    maxPrice: maxPrice !== undefined && maxPrice !== "" ? Number(maxPrice) : undefined,
    brands: Array.isArray(brand) ? brand : brand ? [brand] : undefined,
  });

  const products = response?.res || [];

  const currency = await getCurrencyFromCookie();

  if (products.length < 1) {
    return <NoResultImage />;
  }
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-2 mb-14">
      {products.map((product) => (
        <TopProductCard
          key={product.id}
          imgUrl={product.images}
          name={product.translation?.name || product.sku}
          price={getConvertedPrice(currency, product.base_price)}
          isAvailable={product.is_available}
          dealPrice={getConvertedPrice(currency, product.flash_deal_price || 0) || undefined}
          description={product.translation?.description || []}
          url={Urls.productDetail + "/" + product.url}
          currency={currency}
        />
      ))}
    </div>
  );
};

export default page;
