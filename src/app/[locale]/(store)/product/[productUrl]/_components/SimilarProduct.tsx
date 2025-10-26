import React from "react";
import TopProductCard from "../../../(home)/_components/TopProductCard";
import { TopProducts } from "@/domains/product/constants";

const SimilarProduct = () => {
  return (
    <>
      <div className="w-full my-[100px]">
        <h2 className="font-light block text-2xl text-gray-900">Similar Products</h2>
        <div className="flex justify-between gap-3.5 w-full overflow-x-scroll pb-2">
          {TopProducts.map((product, index) => (
            <TopProductCard
              key={index}
              imgUrl={product.imgUrl}
              name={product.name}
              price={product.price}
              description={product.description}
              url={product.url}
              dealPrice={product.dealPrice}
              staticWidth
              currency={null}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SimilarProduct;
