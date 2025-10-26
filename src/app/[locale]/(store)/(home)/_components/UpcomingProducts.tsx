import { getUpcomingProducts } from "@/actions/product/upcoming_products";
import { UpcomingProductCard } from "./UpcomingProductCard";

interface UpcomingProductsProps {
  locale?: string;
}

const UpcomingProducts = async ({ locale = "en" }: UpcomingProductsProps) => {
  const upcomingProductsData = await getUpcomingProducts(locale);

  // If no data or empty array, show a message
  if (!upcomingProductsData || upcomingProductsData.length === 0) {
    return null;
    // return (
    //   <main className="min-h-screen bg-background py-12 px-4 rounded">
    //     <div className="max-w-7xl mx-auto">
    //       <div className="mb-12 text-center">
    //         <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
    //           Upcoming <span className="text-primary">Innovations</span>
    //         </h1>
    //         <p className="text-lg max-w-2xl mx-auto">
    //           Get ready for the next generation of products. Be the first to know when they launch.
    //         </p>
    //       </div>
    //       <div className="text-center text-muted-foreground">
    //         <p>No upcoming products at the moment. Check back soon!</p>
    //       </div>
    //     </div>
    //   </main>
    // );
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 rounded">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Upcoming <span className="text-primary">Innovations</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto">
            Get ready for the next generation of products. Be the first to know when they launch.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingProductsData.map((product) => {
            // Handle if products is an array (shouldn't be with the foreign key reference)
            const productData = Array.isArray(product.products) ? product.products[0] : product.products;

            if (!productData) return null;

            // Get the first translation (should only be one due to the filter)
            const translation = productData.product_translations?.[0];

            if (!translation) return null;

            // Handle categories which might be an array or single object
            const categoryName = productData.categories
              ? Array.isArray(productData.categories)
                ? productData.categories[0]?.url
                : (productData.categories as any)?.url
              : "Coming Soon";

            return (
              <UpcomingProductCard
                key={product.id}
                productId={product.product_id}
                productName={translation.name}
                description={translation.short_description || translation.description || ""}
                releaseDate={new Date(product.launch_date)}
                image={productData.images?.[0] || "/placeholder.svg"}
                category={categoryName || "Coming Soon"}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default UpcomingProducts;
