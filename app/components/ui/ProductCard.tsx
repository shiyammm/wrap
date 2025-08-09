"use client";
import { Button } from "@/components/ui/button";
import { currency } from "@/constants";
import {
    addToCart,
    getProductFromCart,
    updateCartFromCard
} from "@/lib/actions/cart.action";
import { useSession } from "@/lib/auth-client";
import { Category, Product, Review } from "@/prisma/generated";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import BuySheet from "../buy/BuySheet";

function ProductCard({
    name,
    category,
    images,
    basePrice,
    discountedPrice,
    description,
    inStock,
    id,
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
    const [quantity, setQuantity] = useState(0);
    const [openBuyNow, setOpenBuyNow] = useState(false);

    const userId = data?.user?.id || "";

    const fetchProductFromCart = async () => {
        if (!data?.user?.id) return;

        try {
            const res = await getProductFromCart(id, data.user.id);
            const firstProduct = res?.product?.[0];

            if (firstProduct?.productId === id) {
                setQuantity(firstProduct.quantity);
            } else {
                setQuantity(0);
            }
        } catch (err) {
            console.error("Failed to fetch cart product", err);
            setQuantity(0);
        }
    };

    useEffect(() => {
        fetchProductFromCart();
    }, [data?.user.id]);

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
                await fetchProductFromCart();

                toast.success("Item added to cart", {
                    description: "Check your cart to proceed with checkout."
                });
            } catch (error) {
                console.error("Add to cart error:", error);
                toast.error("Something went wrong while adding item to cart.");
            }
        });
    };

    const onBuyNow = async () => {
        try {
            setOpenBuyNow(true);
        } catch (error) {
            console.error(error);
        }
    };

    const updateQuantity = async (id: string, change: number) => {
        if (!data?.user.id) return;

        const newQuantity = quantity + change;

        if (newQuantity > inStock) return;

        const previousQuantity = quantity;
        setQuantity(newQuantity);

        try {
            const result = await updateCartFromCard(
                data.user.id,
                newQuantity,
                id
            );

            if (!result) {
                throw new Error("Failed to update cart");
            }

            if (newQuantity <= 0) {
                toast.success("Item removed from cart");
            }
        } catch (err) {
            setQuantity(previousQuantity);
            toast.error("Something went wrong. Try again.");
            console.error(err);
        }
    };

    return (
        <>
            <div className="flex min-w-[340px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 ">
                <div
                    className="group relative cursor-pointer"
                    onClick={() => router.push(`/shop/${id}`)}
                >
                    <div className="relative overflow-hidden bg-gradient-to-br from-wrap-orange/40 to-pink-50 p-5 dark:from-rose-950/30 dark:to-pink-950/30">
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
                                <span className="capitalize">
                                    {category?.name}
                                </span>
                                <span className="mx-2">•</span>
                                <span>By {seller.name}</span>
                            </div>

                            <div className="mb-2 flex items-center">
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    ⭐ {averageRating} ({reviews.rating}{" "}
                                    reviews)
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
                    {quantity && quantity > 0 ? (
                        <Button
                            variant="outline"
                            className="w-full border-gray-300 bg-white text-gray-800 transition-all hover:border-orange-50 hover:bg-wrap-orange-dull/10 hover:text-wrap-orange-dull dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-rose-500 dark:hover:bg-gray-700 text-sm cursor-pointer"
                        >
                            <span onClick={() => updateQuantity(id, -1)}>
                                <Minus className="h-4 w-4" />
                            </span>
                            <span className="w-8 text-center">{quantity}</span>
                            <span onClick={() => updateQuantity(id, 1)}>
                                <Plus className="h-4 w-4" />
                            </span>
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => onAddToCart(id, 1, userId)}
                            className="w-full border-gray-300 bg-white text-gray-800 transition-all hover:border-orange-50 hover:bg-wrap-orange-dull/10 hover:text-wrap-orange-dull dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-rose-500 dark:hover:bg-gray-700 text-sm cursor-pointer"
                        >
                            {isPending ? "Adding..." : "Add to Cart"}
                        </Button>
                    )}
                    <Button
                        onClick={onBuyNow}
                        className="w-full bg-gradient-to-r from-wrap-orange-dull to-yellow-200 text-white transition-all hover:from-wrap-orange hover:to-yellow-500 text-sm"
                    >
                        {"Buy Now"}
                    </Button>
                </div>
            </div>
            {openBuyNow && data?.user && (
                <BuySheet
                    setOpenBuyNow={setOpenBuyNow}
                    productId={id}
                    basePrice={basePrice}
                    categoryName={category?.name ?? ""}
                    discountedPrice={discountedPrice ?? 0}
                    image={images[0]}
                    inStock={inStock}
                    name={name}
                />
            )}
        </>
    );
}

export default ProductCard;
