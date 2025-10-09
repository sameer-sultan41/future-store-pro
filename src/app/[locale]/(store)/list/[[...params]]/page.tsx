import React from "react";
import { getProductsByCategory } from "@/actions/list/listServices";
import TopProductCard from "../../(home)/_components/TopProductCard";

const page = async ({ params }: { params: { locale: string; params?: string[] } }) => {
  const { params: pathParams = [], locale } = params;

  console.log("params", params);
  const pathName = Array.isArray(pathParams) ? pathParams.join("/") : "";
  console.log("pathName", pathName);
  const response = await getProductsByCategory(
    pathName,
    locale
    // { sortName: "name", sortType: "asc" },
    // "",
    // "all",
    // 0,
    // 1000,
    // ["b497558c-26f2-4f08-805a-8f96b3e9f717"]
  );
  console.log("response 1", response);
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
