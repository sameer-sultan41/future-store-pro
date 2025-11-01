"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

import { deleteProduct, getProductTranslations, updateProductTranslations } from "@/actions/product/product";
import { Button } from "@/components/ui/button";
import Popup from "@/shared/components/UI/popup";
import { TProductListItem, ProductTranslation } from "@/shared/types/product";
import { cn } from "@/lib/utils";
import { Edit, Trash2, Eye, Globe } from "lucide-react";
import TranslationModal from "../TranslationModal";

type TProps = {
  data: TProductListItem;
  requestReload: () => void;
};

const ProductListItem = ({ data, requestReload }: TProps) => {
  const [showDelete, setShowDelete] = useState(false);
  const [showTranslations, setShowTranslations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [translations, setTranslations] = useState<Record<string, ProductTranslation>>({});
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(false);

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

  const handleOpenTranslations = async () => {
    setIsLoadingTranslations(true);
    setShowTranslations(true);
    const response = await getProductTranslations(data.id);
    if (response.res) {
      setTranslations(response.res);
    }
    setIsLoadingTranslations(false);
  };

  const handleSaveTranslations = async (updatedTranslations: Record<string, ProductTranslation>) => {
    const response = await updateProductTranslations(data.id, updatedTranslations);
    if (response.error) {
      console.error("Error saving translations:", response.error);
      throw new Error(response.error);
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
          <div className="flex justify-center items-center gap-1">
            <Link
              href={`/admin/products/${data.id}`}
              className="cursor-pointer p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded transition-colors"
              title="View Product"
            >
              <Eye className="w-5 h-5" />
            </Link>
            <Link
              href={`/admin/products/${data.id}/edit`}
              className="cursor-pointer p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 dark:text-slate-400 dark:hover:text-green-400 dark:hover:bg-green-900/20 rounded transition-colors"
              title="Edit Product"
            >
              <Edit className="w-5 h-5" />
            </Link>
            <button
              onClick={handleOpenTranslations}
              className="cursor-pointer p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 dark:text-slate-400 dark:hover:text-purple-400 dark:hover:bg-purple-900/20 rounded transition-colors"
              title="Manage Translations"
            >
              <Globe className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="cursor-pointer p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded transition-colors"
              title="Delete Product"
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

      {showTranslations && typeof document !== "undefined" && createPortal(
        <TranslationModal
          isOpen={showTranslations}
          onClose={() => setShowTranslations(false)}
          productId={data.id}
          productName={data.name}
          existingTranslations={translations}
          onSave={handleSaveTranslations}
        />,
        document.body
      )}
    </>
  );
};

export default ProductListItem;
