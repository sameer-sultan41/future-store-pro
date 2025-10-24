import React from "react";
import { UpcomingProductCard } from "./UpcomingProductCard";

const UpcomingProducts = () => {
  const upcomingProducts = [
    {
      productName: "Pro Max Headphones",
      description: "Premium noise-cancelling headphones with 48-hour battery life",
      releaseDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      image: "/images/products/airpods1.jpg",
      category: "Audio",
    },
    {
      productName: "Smart Watch Ultra",
      description: "Advanced fitness tracking with AI health insights",
      releaseDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
      image: "/images/products/airpods1.jpg",
      category: "Wearables",
    },
    {
      productName: "Wireless Charger Pro",
      description: "Fast charging pad with multi-device support",
      releaseDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), // 22 days from now
      image: "/images/products/airpods1.jpg",
      category: "Accessories",
    },
    {
      productName: "Wireless Charger Pro",
      description: "Fast charging pad with multi-device support",
      releaseDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), // 22 days from now
      image: "/images/products/airpods1.jpg",
      category: "Accessories",
    },
  ];
  return (
    <main className="min-h-screen bg-background py-12 px-4 rounded">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Upcoming <span className="text-primary">Innovations</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get ready for the next generation of products. Be the first to know when they launch.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingProducts.map((product, index) => (
            <UpcomingProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default UpcomingProducts;
