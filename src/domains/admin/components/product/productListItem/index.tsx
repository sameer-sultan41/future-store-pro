"use client";
import { useState } from "react";
import { createPortal } from "react-dom";

import { deleteProduct } from "@/actions/product/product";
import { Button } from "@/components/ui/button";
import Popup from "@/shared/components/UI/popup";
import { TProductListItem } from "@/shared/types/product";
import { cn } from "@/lib/utils";
import { Edit, Trash2, Eye } from "lucide-react";

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
      <tr className="even:bg-slate-200 dark:even:bg-slate-700 capitalize text-sm">
        {/* Product Name */}
        <td className="table-td">
          <div className="flex flex-col capitalize px-4 py-2">
            <span className="text-primary font-semibold">{data.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">SKU: {data.id.slice(0, 8)}</span>
          </div>
        </td>

        {/* Category */}
        <td className="table-td">
          <span className="text-sm text-slate-700 dark:text-slate-300">{data.category.name}</span>
        </td>

        {/* Brand */}
        <td className="table-td">
          <span className="text-sm text-slate-700 dark:text-slate-300">{data.brand?.name || "-"}</span>
        </td>

        {/* Price */}
        <td className="table-td">
          <div className="flex flex-col">
            <span className={cn(
              "text-sm font-semibold",
              data.salePrice && data.salePrice !== data.price
                ? "line-through text-slate-400"
                : "text-slate-900 dark:text-white"
            )}>
              $ {data.price.toFixed(2)}
            </span>
            {data.salePrice && data.salePrice !== data.price && (
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                ${data.salePrice.toFixed(2)}
              </span>
            )}
          </div>
        </td>

        {/* Status */}
        <td className="table-td text-center">
          <span className="block w-full">
            <span className={cn(
              "inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25",
              data.isAvailable
                ? "text-green-600 bg-green-200"
                : "text-red-600 bg-red-200"
            )}>
              {data.isAvailable ? "active" : "inactive"}
            </span>
          </span>
        </td>

        {/* Actions */}
        <td className="table-td">
          <div className="flex justify-center items-center">
            <button
              onClick={() => console.log("view product", data.id)}
              className="cursor-pointer text-[20px] text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => console.log("edit product", data.id)}
              className="cursor-pointer text-[20px] mx-4 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="cursor-pointer text-[20px] text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </td>
      </tr>

      {showDelete && typeof document !== "undefined" && createPortal(
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
        />,
        document.body
      )}
    </>
  );
};

export default ProductListItem;
