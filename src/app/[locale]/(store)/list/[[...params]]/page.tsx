import React from "react";
import { getProductsByCategory } from "@/actions/list/listServices";
import TopProductCard from "../../(home)/_components/TopProductCard";

const page = async ({
  params,
  searchParams,
}: {
  params: { locale: string; params?: string[] };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { params: pathParams = [], locale } = params;
  const { availability, minPrice, maxPrice, brand } = await searchParams;

  console.log("searchParams", searchParams);
  const pathName = Array.isArray(pathParams) ? pathParams.join("/") : "";

  const response = await getProductsByCategory(
    pathName,
    locale,
    { sortName: "name", sortType: "asc" },
    "",
    "all",
    Number(minPrice) || undefined,
    Number(maxPrice) || undefined,
    brand
  );

  const products = response?.res || [];
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-2 mb-14">
      {products.map((product) => (
        <TopProductCard
          key={product.id}
          imgUrl={product.images}
          name={product.translation?.name || product.sku}
          price={product.base_price}
          isAvailable={product.is_available}
          dealPrice={undefined}
          specs={product.translation?.special_features || []}
          url={"/product/" + product.id}
        />
      ))}
    </div>
  );
};

export default page;
