"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import Image from "next/image";

import { getAllBrands } from "@/actions/brands/brands";
import { getAllCategoriesJSON } from "@/actions/category/category";
import { getCategorySpecs } from "@/actions/category/specifications";
import Input from "@/shared/components/UI/input";
import { TBrand } from "@/shared/types";
import { TGroupJSON } from "@/shared/types/categories";
import { TAddProductFormValues } from "@/shared/types/product";
import { cn } from "@/shared/utils/styling";

type SelectOption = {
  value: string;
  label: string;
};

type SpecGroup = {
  id: string;
  title: string;
  specs: string[];
};

type TProps = {
  formValues?: TAddProductFormValues;
  onChange?: (props: TAddProductFormValues) => void;
  initialData?: TAddProductFormValues;
  onSubmit?: (values: TAddProductFormValues) => void;
  isLoading?: boolean;
};

const SimpleProductForm = ({ 
  formValues: externalFormValues, 
  onChange: externalOnChange,
  initialData,
  onSubmit,
  isLoading: externalLoading = false
}: TProps) => {
  // Use internal state if no external formValues provided (for edit mode)
  const [internalFormValues, setInternalFormValues] = useState<TAddProductFormValues>(
    initialData || externalFormValues || {
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
    }
  );

  // Use external or internal form values
  const props = externalFormValues || internalFormValues;
  
  // Use external or internal onChange
  const handleChange = (newValues: TAddProductFormValues) => {
    if (externalOnChange) {
      externalOnChange(newValues);
    } else {
      setInternalFormValues(newValues);
    }
  };
  
  const onChange = externalOnChange || handleChange;
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [brands, setBrands] = useState<SelectOption[]>([]);
  const [categorySpecs, setCategorySpecs] = useState<SpecGroup[]>([]);
  const [isLoadingSpecs, setIsLoadingSpecs] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [categoriesResult, brandsResult] = await Promise.all([
      getAllCategoriesJSON("en"),
      getAllBrands(),
    ]);

    if (categoriesResult.res) {
      const flatCategories = flattenCategories(categoriesResult.res);
      setCategories(flatCategories);
    }

    if (brandsResult.res) {
      setBrands(
        brandsResult.res.map((brand) => ({
          value: brand.id,
          label: brand.name,
        }))
      );
    }
  };

  const flattenCategories = (json: TGroupJSON[]): SelectOption[] => {
    const result: SelectOption[] = [];
    json.forEach((group) => {
      result.push({
        value: group.group.id,
        label: group.group.name,
      });
      group.categories.forEach((category) => {
        result.push({
          value: category.category.id,
          label: `${group.group.name} > ${category.category.name}`,
        });
        category.subCategories.forEach((sub) => {
          result.push({
            value: sub.id,
            label: `${group.group.name} > ${category.category.name} > ${sub.name}`,
          });
        });
      });
    });
    return result;
  };

  const handleCategoryChange = async (option: SelectOption | null) => {
    const categoryID = option?.value || "";
    onChange({ ...props, categoryID });

    if (!categoryID) {
      setCategorySpecs([]);
      return;
    }

    setIsLoadingSpecs(true);
    const response = await getCategorySpecs(categoryID);
    if (response.res) {
      const specsObject: any = {};
      response.res.forEach((group) => {
        specsObject[group.title] = {};
        group.specs.forEach((spec) => {
          specsObject[group.title][spec] = "";
        });
      });

      onChange({
        ...props,
        categoryID,
        specs: specsObject,
      });

      setCategorySpecs(
        response.res.map((item) => ({
          id: item.id,
          title: item.title,
          specs: item.specs,
        }))
      );
    }
    setIsLoadingSpecs(false);
  };

  const addImageField = () => {
    onChange({ ...props, images: [...props.images, ""] });
  };

  const removeImageField = (index: number) => {
    const newImages = props.images.filter((_, i) => i !== index);
    onChange({ ...props, images: newImages });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...props.images];
    newImages[index] = value;
    onChange({ ...props, images: newImages });
  };

  const updateSpec = (groupTitle: string, specName: string, value: string) => {
    const updatedSpecs = { ...props.specs };
    if (!updatedSpecs[groupTitle]) {
      updatedSpecs[groupTitle] = {};
    }
    updatedSpecs[groupTitle][specName] = value;
    onChange({ ...props, specs: updatedSpecs });
  };

  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: "42px",
      borderColor: state.isFocused ? "#3b82f6" : "#e2e8f0",
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 50,
    }),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(props);
    }
  };

  return (
    <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Details */}
      <div className="">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
          BASIC DETAILS
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              SKU <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={props.sku}
              placeholder="e.g., PROD-001"
              onChange={(e) => onChange({ ...props, sku: e.currentTarget.value })}
              className = "py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={props.url}
              placeholder="e.g., product-name"
              onChange={(e) => onChange({ ...props, url: e.currentTarget.value })}
              className = "py-2"
            />
          </div>

          <div className="">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Product Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={props.name}
              placeholder="Enter product name"
              onChange={(e) => onChange({ ...props, name: e.currentTarget.value })}
              className = "py-2"
            />
          </div>

          <div className="">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Short Description
            </label>
            <Input
              type="text"
              value={props.shortDescription}
              placeholder="Brief description (1-2 lines)"
              onChange={(e) => onChange({ ...props, shortDescription: e.currentTarget.value })}
              className = "py-2"
            />
          </div>

          <div className="">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              value={props.description}
              placeholder="Full product description"
              onChange={(e) => onChange({ ...props, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      {/* Category & Brand */}
      <div className="">
        <h3 className="text-bse font-semibold text-slate-900 dark:text-white mb-4 uppercase">
          Category & Brand
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <Select
              options={categories}
              value={categories.find((c) => c.value === props.categoryID) || null}
              onChange={handleCategoryChange}
              placeholder="Select category..."
              isClearable
              styles={customSelectStyles}
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Brand <span className="text-red-500">*</span>
            </label>
            <Select
              options={brands}
              value={brands.find((b) => b.value === props.brandID) || null}
              onChange={(option) => onChange({ ...props, brandID: option?.value || "" })}
              placeholder="Select brand..."
              isClearable
              styles={customSelectStyles}
              classNamePrefix="react-select"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Pricing</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Selling Price <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={props.price}
              placeholder="0.00"
              onChange={(e) => onChange({ ...props, price: e.currentTarget.value })}
              className = "py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Cost Price
            </label>
            <Input
              type="number"
              value={props.costPrice}
              placeholder="0.00"
              onChange={(e) => onChange({ ...props, costPrice: e.currentTarget.value })}
              className = "py-2"
            />
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 uppercase">Inventory</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={props.stockQuantity}
              placeholder="0"
              onChange={(e) => onChange({ ...props, stockQuantity: e.currentTarget.value })}
              className = "py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Low Stock Alert
            </label>
            <Input
              type="number"
              value={props.lowStockThreshold}
              placeholder="5"
              onChange={(e) => onChange({ ...props, lowStockThreshold: e.currentTarget.value })}
              className = "py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Weight (kg)
            </label>
            <Input
              type="number"
              value={props.weight}
              placeholder="0.0"
              onChange={(e) => onChange({ ...props, weight: e.currentTarget.value })}
              className = "py-2"
            />
          </div>

          <div className="col-span-3">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={props.isAvailable}
                  onChange={(e) => onChange({ ...props, isAvailable: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Available for Sale
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={props.isFeatured}
                  onChange={(e) => onChange({ ...props, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Featured Product
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white uppercase">Product Images</h3>
          <button
            type="button"
            onClick={addImageField}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add Image
          </button>
        </div>
        <div className="space-y-4">
          {props.images.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
              No images added yet
            </p>
          ) : (
            props.images.map((img, index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={img}
                    placeholder={`Image URL ${index + 1}`}
                    onChange={(e) => updateImage(index, e.target.value)}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData('text');
                      updateImage(index, pastedText);
                    }}
                    className="flex-1 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="px-3 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                {/* Image Preview */}
                {img && img.trim() !== "" && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                    <Image
                      src={img}
                      alt={`Preview ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector(".error-message")) {
                          const errorDiv = document.createElement("div");
                          errorDiv.className = "error-message absolute inset-0 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 p-2 text-center bg-slate-100 dark:bg-slate-700";
                          errorDiv.innerHTML = '<span>⚠️ Failed to load<br/>image</span>';
                          parent.appendChild(errorDiv);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Specifications */}
      {props.categoryID && (
        <div className="">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
            Specifications
          </h3>
          {isLoadingSpecs ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : categorySpecs.length > 0 ? (
            <div className="space-y-6">
              {categorySpecs.map((group) => (
                <div key={group.id}>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                    {group.title}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {group.specs.map((spec, index) => (
                      <div key={index}>
                        <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1.5">
                          {spec}
                        </label>
                        <Input
                          type="text"
                          value={props.specs?.[group.title]?.[spec] || ""}
                          placeholder={`Enter ${spec.toLowerCase()}`}
                          onChange={(e) => updateSpec(group.title, spec, e.currentTarget.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
              No specifications available for this category
            </p>
          )}
        </div>
      )}

      {/* Additional Settings */}
      {/* <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
          Additional Settings
        </h3>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Sort Order
          </label>
          <Input
            type="number"
            value={props.sortOrder}
            placeholder="0"
            onChange={(e) => onChange({ ...props, sortOrder: e.currentTarget.value })}
            className="w-48"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Lower numbers appear first
          </p>
        </div>
      </div> */}
    </form>
  );
};

export default SimpleProductForm;

