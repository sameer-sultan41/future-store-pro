import { ProductListSkeleton } from "@/domains/shop/productList/components";
import React from "react";

const loading = () => {
  return (
    <div className="flex gap-5 items-center">
      {Array.from({ length: 10 }).map((_, idx) => (
        <ProductListSkeleton key={idx} />
      ))}
    </div>
  );
};

export default loading;
