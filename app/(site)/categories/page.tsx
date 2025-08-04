import CategoryCard from "@/app/components/ui/CategoryCard";
import { getAllCategories } from "@/lib/actions/products.action";
import React from "react";

const CategoryPage = async () => {
  const categories = await getAllCategories();

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Page Title */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Explore Categories
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
          Discover the perfect gift across our curated collection.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            categoryId={category.id}
            name={category.name}
            imageUrl={
              category.products[0]?.images[0] || "/placeholder-image.png"
            }
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
