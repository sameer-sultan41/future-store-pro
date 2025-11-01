"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, Tag, DollarSign, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { getProductById } from "@/actions/product/product";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductDetail = {
    id: string;
    sku: string;
    url: string;
    name: string;
    description: string;
    shortDescription: string;
    categoryName: string;
    brandName: string;
    price: number;
    costPrice: number | null;
    isAvailable: boolean;
    isFeatured: boolean;
    stockQuantity: number;
    lowStockThreshold: number;
    weight: number | null;
    images: string[];
    sortOrder: number;
    specs: any;
};

export default function ViewProductPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            const productId = params.id as string;
            const result = await getProductById(productId);

            if (result.error) {
                console.error("Error fetching product:", result.error);
                setIsLoading(false);
                return;
            }

            if (result.data) {
                setProduct(result.data);
            }
            setIsLoading(false);
        };

        fetchProduct();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-end">
                <Link href={`/admin/products/${product.id}/edit`}>
                    <Button>Edit Product</Button>
                </Link>
            </div>

            {/* Product Info Card */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Images */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                                Product Images
                            </h3>
                            {product.images && product.images.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {product.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700"
                                        >
                                            <Image
                                                src={img}
                                                alt={`${product.name} - Image ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-64 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                    <div className="text-center">
                                        <ImageIcon className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                                        <p className="text-sm text-slate-500 dark:text-slate-400">No images</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Details */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    {product.name}
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    SKU: {product.sku}
                                </p>
                            </div>

                            {/* Status Badges */}
                            <div className="flex gap-2">
                                <span
                                    className={cn(
                                        "px-3 py-1 rounded-full text-sm font-medium",
                                        product.isAvailable
                                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                    )}
                                >
                                    {product.isAvailable ? "Available" : "Unavailable"}
                                </span>
                                {product.isFeatured && (
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                        Featured
                                    </span>
                                )}
                            </div>

                            {/* Short Description */}
                            {product.shortDescription && (
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Short Description
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {product.shortDescription}
                                    </p>
                                </div>
                            )}

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Category</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {product.categoryName}
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Brand</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {product.brandName || "-"}
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Price</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                                        ${product.price.toFixed(2)}
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Cost Price</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                                        {product.costPrice ? `$${product.costPrice.toFixed(2)}` : "-"}
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Stock</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {product.stockQuantity} units
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Weight</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {product.weight ? `${product.weight} kg` : "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Full Description */}
                    {product.description && (
                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                                Full Description
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                                {product.description}
                            </p>
                        </div>
                    )}

                    {/* Specifications */}
                    {product.specs && Object.keys(product.specs).length > 0 && (
                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                                Specifications
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(product.specs).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                                            {key.replace(/_/g, " ")}
                                        </span>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">{value as string}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

