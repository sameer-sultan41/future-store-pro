"use client";
import { useState } from "react";

import { deleteProduct } from "@/actions/product/product";
import { Button } from "@/components/ui/button";
import Popup from "@/shared/components/UI/popup";
import { TProductListItem } from "@/shared/types/product";
import { cn } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";

type TProps = {
  data: TProductListItem;
  requestReload: () => void;
};

const ProductListItem = ({ data, requestReload }: TProps) => {
  const [showDelete, setShowDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const response = await deleteProduct(data.id);
    if (response.error) {
      setIsLoading(false);
    }
    if (response.res) {
      setIsLoading(false);
      setShowDelete(false);
      requestReload();
    }
  };

  return (
    <>
      <div className="flex items-center gap-6 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        {/* Product Name */}
        <div className="flex-1">
          <p className="font-medium text-slate-900 dark:text-white whitespace-nowrap">{data.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 whitespace-nowrap">SKU: {data.id.slice(0, 8)}</p>
        </div>

        {/* Category */}
        <div className="whitespace-nowrap">
          <span className="text-sm text-slate-700 dark:text-slate-300">{data.category.name}</span>
        </div>

        {/* Brand */}
        <div className="whitespace-nowrap">
          <span className="text-sm text-slate-700 dark:text-slate-300">{data.brand?.name || "-"}</span>
        </div>

        {/* Price */}
        <div className="text-right whitespace-nowrap">
          <div className="flex flex-col items-end">
            <span className={cn(
              "text-sm font-semibold",
              data.salePrice && data.salePrice !== data.price
                ? "line-through text-slate-400"
                : "text-slate-900 dark:text-white"
            )}>
              ${data.price.toFixed(2)}
            </span>
            {data.salePrice && data.salePrice !== data.price && (
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                ${data.salePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex justify-center whitespace-nowrap">
          <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            data.isAvailable
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          )}>
            {data.isAvailable ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end whitespace-nowrap">
          <button
            onClick={() => console.log("edit product", data.id)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showDelete && (
        <Popup
          content={
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Delete Product</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Are you sure you want to delete <strong>{data.name}</strong>? This action cannot be undone.
              </p>
            </div>
          }
          width="450px"
          isLoading={isLoading}
          onCancel={() => setShowDelete(false)}
          onClose={() => setShowDelete(false)}
          onSubmit={() => handleDelete()}
          cancelBtnText="Cancel"
          confirmBtnText="Delete"
        />
      )}
    </>
  );
};

export default ProductListItem;
