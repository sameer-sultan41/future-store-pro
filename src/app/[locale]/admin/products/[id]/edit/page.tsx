"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, X } from "lucide-react";
import Link from "next/link";

import { getProductById, updateProduct } from "@/actions/product/product";
import SimpleProductForm from "@/domains/admin/components/product/productForm";
import { Button } from "@/components/ui/button";
import { TAddProductFormValues } from "@/shared/types/product";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<TAddProductFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const productId = params.id as string;
      const result = await getProductById(productId);

      if (result.error) {
        console.error("Error fetching product:", result.error);
        setIsFetching(false);
        return;
      }

      if (result.data) {
        // Transform data to form values
        const formValues: TAddProductFormValues = {
          sku: result.data.sku,
          url: result.data.url,
          name: result.data.name,
          description: result.data.description || "",
          shortDescription: result.data.shortDescription || "",
          categoryID: result.data.categoryId,
          brandID: result.data.brandId,
          price: result.data.price.toString(),
          costPrice: result.data.costPrice?.toString() || "",
          isAvailable: result.data.isAvailable,
          isFeatured: result.data.isFeatured,
          stockQuantity: result.data.stockQuantity.toString(),
          lowStockThreshold: result.data.lowStockThreshold.toString(),
          weight: result.data.weight?.toString() || "",
          images: result.data.images || [],
          sortOrder: result.data.sortOrder.toString(),
          specs: result.data.specs || {},
        };
        setFormData(formValues);
      }
      setIsFetching(false);
    };

    fetchProduct();
  }, [params.id]);

  const handleSubmit = async (values: TAddProductFormValues) => {
    setIsLoading(true);
    const productId = params.id as string;
    const result = await updateProduct(productId, values);

    if (result.error) {
      console.error("Error updating product:", result.error);
      setIsLoading(false);
      return;
    }

    if (result.res) {
      router.push("/admin/products");
    }
  };

  const handleDiscard = () => {
    router.push("/admin/products");
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">Product not found</p>
        <Button onClick={() => router.push("/admin/products")} className="mt-4">
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* Form */}
      <div className="sm:w-[80%] w-full bg-white dark:bg-slate-800 rounded-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-600 dark:text-white mb-4">EDIT PRODUCT</h2>
        {/* Form */}
        <SimpleProductForm initialData={formData} onSubmit={handleSubmit} isLoading={isLoading} />
        <div className="flex items-center gap-3 pt-4 justify-end">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleDiscard} disabled={isLoading}>
              <X className="w-4 h-4 mr-2" />
              Discard
            </Button>
            <Button type="submit" form="product-form" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2 cursor-pointer" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
