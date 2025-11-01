"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

import { getAllProducts } from "@/actions/product/product";
import ProductListItem from "@/domains/admin/components/product/productListItem";
import { Button } from "@/components/ui/button";
import Input from "@/shared/components/UI/input";
import { TProductListItem } from "@/shared/types/product";
import { Plus } from "lucide-react";

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
    <div className="w-full">
      {/* Search and Actions */}
      <div className="flex max-sm:flex-col sm:justify-between sm:items-center sm:mb-6 mb-2 w-full">
        <div className="max-sm:mb-4 w-[30%]">
          <Input
            type="text"
            placeholder="Search Products..."
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
            className="w-full py-2 capitalize"
          />
        </div>

        <div className="flex flex-wrap">
          <Link href="/admin/products/new">
            <Button className="bg-primary cursor-pointer text-white hover:bg-primary/90 w-full font-normal">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
              <thead className="bg-slate-200 dark:bg-slate-700">
                <tr className="font-semibold uppercase text-sm text-left text-slate-700 dark:text-slate-300">
                  <th scope="col" className="py-2 px-4">Product Name</th>
                  <th scope="col" className="">Category</th>
                  <th scope="col" className="">Brand</th>
                  <th scope="col" className="">Price</th>
                  <th scope="col" className="text-center">Status</th>
                  <th scope="col" className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                {isFetching ? (
                  <tr>
                    <td colSpan={6} className="p-4">
                      <div className="flex items-center justify-center w-full py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : productsList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center">
                      <div className="py-8">
                        <p className="text-slate-500 dark:text-slate-400 mb-4">No products found</p>
                        <Link href="/admin/products/new">
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Product
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center">
                      <div className="py-8">
                        <p className="text-slate-500 dark:text-slate-400 mb-2">No products match your search</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500">Try adjusting your search terms</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <ProductListItem key={product.id} data={product} requestReload={getProductsList} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
