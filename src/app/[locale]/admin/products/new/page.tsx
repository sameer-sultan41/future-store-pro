"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X } from "lucide-react";
import Link from "next/link";

import { addProduct } from "@/actions/product/product";
import SimpleProductForm from "@/domains/admin/components/product/productForm";
import { Button } from "@/components/ui/button";
import { TAddProductFormValues } from "@/shared/types/product";

const initialForm: TAddProductFormValues = {
  sku: "",
  url: "",
  name: "",
  description: "",
  shortDescription: "",
  categoryID: "",
  brandID: "",
  price: "",
  costPrice: "",
  isAvailable: true,
  isFeatured: false,
  stockQuantity: "",
  lowStockThreshold: "5",
  weight: "",
  images: [],
  sortOrder: "0",
  specs: {},
};

const NewProductPage = () => {
  const router = useRouter();
  const [formValues, setFormValues] = useState<TAddProductFormValues>(initialForm);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await addProduct(formValues);
      if (result.error) {
        console.error("Error adding product:", result.error);
        setIsLoading(false);
      }
      if (result.res) {
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Form */}
      <div className="sm:w-[80%] w-full bg-white dark:bg-slate-800 rounded-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-600 dark:text-white mb-4">ADD PRODUCT</h2>
      <SimpleProductForm formValues={formValues} onChange={setFormValues} />
          <div className="flex items-center gap-3 pt-4 justify-end ">
            <Link href="/admin/products">
              <Button variant="outline" className="gap-2">
                Discard
              </Button>
            </Link>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  Save Product
                </>
              )}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default NewProductPage;

