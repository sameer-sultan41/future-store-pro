"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

import { getAllProducts } from "@/actions/product/product";
import ProductListItem from "@/domains/admin/components/product/productListItem";
import { Button } from "@/components/ui/button";
import Input from "@/shared/components/UI/input";
import { TProductListItem } from "@/shared/types/product";

const AdminProducts = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [productsList, setProductsList] = useState<TProductListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getProductsList();
  }, []);

  const getProductsList = async () => {
    setIsFetching(true);
    const response = await getAllProducts();
    if (response.res) setProductsList(response.res as TProductListItem[]);
    setIsFetching(false);
  };

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return productsList;

    const query = searchQuery.toLowerCase();
    return productsList.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.name.toLowerCase().includes(query) ||
        product.brand?.name?.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query)
      );
    });
  }, [productsList, searchQuery]);

  return (
    <>
      <div className="flex justify-between items-center gap-4 mb-4">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2"
          />
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            + Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        {isFetching ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : productsList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 mb-4">No products found</p>
            <Link href="/admin/products/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                + Add Your First Product
              </Button>
            </Link>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 mb-2">No products match your search</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Table Header */}
            <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-6 px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                <div className="whitespace-nowrap">Product Name</div>
                <div className="whitespace-nowrap">Category</div>
                <div className="whitespace-nowrap">Brand</div>
                <div className="text-right whitespace-nowrap">Price</div>
                <div className="text-center whitespace-nowrap">Status</div>
                <div className="text-right whitespace-nowrap">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredProducts.map((product) => (
                <ProductListItem key={product.id} data={product} requestReload={getProductsList} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminProducts;
