import React from "react";
import { getProducts } from "@/lib/actions/products.action";
import ProductCard from "@/app/components/ui/ProductCard";

const ShopPage = async () => {
    const products = await getProducts();

    return (
        <section className="min-h-screen w-full bg-white py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        🛍️ Shop All Gifts
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Explore our curated collection of gifts for every
                        occasion.
                    </p>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                {...product}
                                reviews={product.reviews[0] ?? []}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">
                        No products available.
                    </p>
                )}
            </div>
        </section>
    );
};

export default ShopPage;
