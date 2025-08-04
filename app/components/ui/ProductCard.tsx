"use client";
import { Button } from "@/components/ui/button";
import { currency } from "@/constants";
import { addToCart } from "@/lib/actions/cart.action";
import { useSession } from "@/lib/auth-client";
import { Category, Product, Review } from "@/prisma/generated";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

function ProductCard({
    basePrice,
    discountedPrice,
    description,
    id,
    images,
    inStock,
    name,
    category,
    seller,
    reviews
}: Product & {
    category: Category | null;
    seller: { name: string };
    reviews: Review;
}) {
    const averageRating = reviews.rating > 0 ? reviews.rating : "4.8";
    const router = useRouter();
    const { data } = useSession();
    const [isPending, startTransition] = useTransition();

    const userId = data?.user?.id || "";

    const onAddToCart = async (
        id: string,
        quantity: number,
        userId: string
    ) => {
        if (!userId) {
            toast.error("You must be logged in to add items to the cart.");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
            return;
        }

        startTransition(async () => {
            try {
                const res = await addToCart(id, quantity, userId);

                if (!res) {
                    throw new Error("Failed to add item to cart");
                }

                toast.success("Item added to cart", {
                    description: "Check your cart to proceed with checkout."
                });
            } catch (error) {
                console.error("Add to cart error:", error);
                toast.error("Something went wrong while adding item to cart.");
            }
        });
    };

    const onBuyNow = () => {
        // Handle buy now logic
    };

    return (
        <div className="flex w-[340px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 ">
            <div
                className="group relative cursor-pointer"
                onClick={() => router.push(`/shop/${id}`)}
            >
                <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 to-pink-50 p-5 dark:from-rose-950/30 dark:to-pink-950/30">
                    <div className="absolute -bottom-10 left-1/2 h-40 w-40 -translate-x-1/2 transform rounded-full bg-rose-500/20 blur-3xl"></div>

                    <Image
                        src={images[0]}
                        alt={name}
                        width={290}
                        height={290}
                        className="mx-auto h-[200px] object-contain rounded-lg transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                    <div>
                        <h3 className="mb-1.5 text-lg font-semibold text-gray-900 dark:text-white">
                            {name.slice(0, 25)}...
                        </h3>

                        <div className="mb-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <span className="capitalize">{category?.name}</span>
                            <span className="mx-2">•</span>
                            <span>By {seller.name}</span>
                        </div>

                        <div className="mb-2 flex items-center">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                ⭐ {averageRating} ({reviews.rating} reviews)
                            </span>
                        </div>

                        <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                            {description.slice(0, 30)}...
                        </p>
                    </div>

                    <div className="mt-auto flex flex-col">
                        <div className="text-lg font-bold text-rose-700 dark:text-rose-400">
                            {discountedPrice && (
                                <span>
                                    {currency}
                                    {(discountedPrice / 100).toFixed(2)}
                                </span>
                            )}
                            <span className="ml-2 text-sm line-through text-gray-500 dark:text-gray-400">
                                {currency}
                                {(basePrice / 100).toFixed(2)}
                            </span>
                        </div>

                        {inStock > 0 && (
                            <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                                In stock ({inStock})
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 px-4 pb-5">
                <Button
                    variant="outline"
                    onClick={() => onAddToCart(id, 1, userId)}
                    className="w-full border-gray-300 bg-white text-gray-800 transition-all hover:border-rose-500 hover:bg-rose-50 hover:text-rose-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-rose-500 dark:hover:bg-gray-700 text-sm cursor-pointer"
                >
                    {isPending ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                    onClick={onBuyNow}
                    className="w-full bg-gradient-to-r from-rose-400 to-pink-300 text-white transition-all hover:from-rose-400 hover:to-pink-300 text-sm"
                >
                    Buy now
                </Button>
            </div>
        </div>
    );
}

export default ProductCard;
