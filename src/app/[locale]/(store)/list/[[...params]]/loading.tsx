import { ProductListSkeleton } from "@/domains/shop/productList/components";
import React from "react";

const loading = () => {
  return (
    <div>
      <ProductListSkeleton />
    </div>
  );
};

export default loading;
