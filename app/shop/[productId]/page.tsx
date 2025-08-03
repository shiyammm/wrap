import ProductCard from "@/app/components/ui/ProductCard";
import ProductDetails from "@/app/components/ui/ProductDetails";
import {
    getProductById,
    getProducts,
    getProductsByCategory
} from "@/lib/actions/products.action";
import React from "react";

export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((p) => ({ productId: p.id }));
}

export const revalidate = 60;

type paramsType = Promise<{ productId: string }>;

const ProductDetailsPage = async ({ params }: { params: paramsType }) => {
    const { productId } = await params;

    const productDetails = await getProductById(productId);

    const relatedProducts = await getProductsByCategory(
        productDetails.category.id
    );

    if (!productDetails) {
        return (
            <div className="container mx-auto py-10">
                <p className="text-center text-lg font-semibold text-red-500">
                    Product not found.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="w-full flex justify-center px-4 py-8">
                <ProductDetails key={productId} {...productDetails} />
            </div>

            <div>
                <div className="mt-[10rem] text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        🎁 You Might Also Like
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Discover handpicked products similar to your interest —
                        perfect for any celebration or special moment.
                    </p>
                </div>
                <div className="flex gap-5 mt-[5rem] flex-wrap justify-center">
                    {relatedProducts.length > 0 &&
                        relatedProducts
                            .filter((product) => product.id !== productId)
                            .map((prod) => (
                                <ProductCard
                                    {...prod}
                                    key={prod.id}
                                    reviews={prod.reviews[0] ?? []}
                                />
                            ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
