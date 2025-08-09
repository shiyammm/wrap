"use client";

import { Button } from "@/components/ui/button";
import { currency } from "@/constants";
import {
    addToCart,
    getProductFromCart,
    updateCartFromCard
} from "@/lib/actions/cart.action";
import { useSession } from "@/lib/auth-client";
import { Minus, Plus, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import ProductThumbnail from "../admin/ProductThumbnail";
import { Category, Product, Review, User } from "@/prisma/generated";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import BuySheet from "../buy/BuySheet";

// interface AddToCartPayload {
//     productId: string;
//     productName: string;
//     quantity: number;
//     price: number;
//     originalPrice?: number;
//     salePrice?: number;
//     totalPrice: number;
//     isOnSale: boolean;
// }

export default function ProductDetails({
    id,
    name,
    description,
    images,
    basePrice,
    discountedPrice,
    inStock,
    category,
    seller,
    reviews
}: Product & {
    category?: Category | null;
    seller?: { name: string };
    reviews?: (Review & { user: User })[];
}) {
    const [quantity, setQuantity] = useState(0);
    const priceInRupees = basePrice / 100;
    const saleInRupees = discountedPrice ? discountedPrice / 100 : undefined;
    const isOnSale = saleInRupees !== undefined && saleInRupees < priceInRupees;
    const effectivePrice = isOnSale ? saleInRupees : priceInRupees;
    const { data } = useSession();
    // const [isLoading, setIsLoading] = useState(false);
    const [openBuyNow, setOpenBuyNow] = useState(false);

    const router = useRouter();

    const [isPending, startTransition] = useTransition();

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

    const onAddToCart = async (id: string, quantity: number) => {
        if (!data?.user.id) {
            toast.error("You must be logged in to add items to the cart.");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
            return;
        }

        startTransition(async () => {
            try {
                const res = await addToCart(id, quantity, data.user.id);

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

    const updateQuantity = async (id: string, change: number) => {
        if (!data?.user.id) return;

        const newQuantity = quantity + change;

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

    const onBuyNow = async () => {
        try {
            setOpenBuyNow(true);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div>
                <div className="grid w-full max-w-6xl grid-cols-1 gap-12 rounded-lg md:grid-cols-2">
                    <div className="relative w-full overflow-hidden rounded-2xl p-5 dark:from-teal-950/30 dark:to-cyan-950/30">
                        <ProductThumbnail images={images} isOnSale={isOnSale} />
                    </div>

                    <div className="flex flex-col gap-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                                {name}
                            </h2>
                            <p className="mt-3 text-gray-600 dark:text-gray-400">
                                {description}
                            </p>
                            <Link
                                href={`/categories/${category?.id}`}
                                className="mt-2 inline-block"
                            >
                                <Badge variant={"secondary"}>
                                    {category?.name}
                                </Badge>
                            </Link>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="mt-auto flex flex-col">
                                <div className="text-2xl font-bold text-rose-700 dark:text-rose-400">
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
                            </div>
                        </div>

                        {inStock > 0 ? (
                            <div className="rounded-md bg-green-50 p-3 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                <p className="text-sm font-bold">In Stock</p>
                                <span className="mt-1 text-sm font-normal">
                                    {inStock} units available
                                </span>
                            </div>
                        ) : (
                            <div className="rounded-md bg-amber-50 p-3 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                                <p className="text-sm font-bold">
                                    Currently out of stock
                                </p>
                            </div>
                        )}

                        <div className="mt-2 flex flex-col flex-wrap gap-3 sm:flex-row">
                            {quantity && quantity > 0 ? (
                                <Button
                                    variant="outline"
                                    className="w-full border-gray-300 bg-white text-gray-800 transition-all hover:border-orange-50 hover:bg-wrap-orange-dull/10 hover:text-wrap-orange-dull dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-rose-500 dark:hover:bg-gray-700 text-sm cursor-pointer"
                                >
                                    <span
                                        onClick={() => updateQuantity(id, -1)}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </span>
                                    <span className="w-8 text-center">
                                        {quantity}
                                    </span>
                                    <span onClick={() => updateQuantity(id, 1)}>
                                        <Plus className="h-4 w-4" />
                                    </span>
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full border-gray-300 bg-white text-gray-800 transition-all hover:border-orange-50 hover:bg-wrap-orange-dull/10 hover:text-wrap-orange-dull dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-rose-500 dark:hover:bg-gray-700 text-sm cursor-pointer"
                                    onClick={() => onAddToCart(id, 1)}
                                    disabled={inStock === 0 || isPending}
                                >
                                    {isPending ? "Adding..." : "Add to Cart"}
                                </Button>
                            )}

                            <Button
                                className="w-full bg-gradient-to-r from-wrap-orange-dull to-yellow-200 text-white transition-all hover:from-wrap-orange hover:to-yellow-500 text-sm cursor-pointer"
                                onClick={onBuyNow}
                            >
                                {"Buy Now"}
                            </Button>
                        </div>

                        <div className="mt-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                Selected:
                            </p>
                            <div className="mt-2 flex justify-between text-sm">
                                <p>
                                    {quantity} × {currency}
                                    {effectivePrice.toFixed(2)}
                                </p>
                                <p>
                                    Total: {currency}
                                    {(quantity * effectivePrice).toFixed(2)}
                                </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {inStock > 0 ? "In Stock" : "Out of Stock"} (
                                {inStock} available)
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-20">
                    <div className="mb-10 flex gap-1 justify-center items-center">
                        <Star size={14} fill="orange" stroke="orange" />
                        <Star size={14} fill="orange" stroke="orange" />
                        <Star size={14} fill="orange" stroke="orange" />
                        <h3 className="text-xl font-semibold text-center mx-3">
                            Customer Reviews{" "}
                        </h3>
                        <Star size={14} fill="orange" stroke="orange" />
                        <Star size={14} fill="orange" stroke="orange" />
                        <Star size={14} fill="orange" stroke="orange" />
                    </div>
                    {reviews && reviews.length === 0 ? (
                        <p className="text-gray-500">
                            No reviews yet. Be the first to review!
                        </p>
                    ) : (
                        <div className="space-y-4 grid-cols-1  md:grid-cols-2  xl:grid-cols-3 grid gap-4">
                            {reviews?.map((review) => (
                                <div
                                    key={review.id}
                                    className="border border-gray-100 p-5 rounded-xl shadow-md"
                                >
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold">
                                            {review?.user?.name || "Anonymous"}
                                        </p>
                                        <div className="flex items-center text-yellow-500">
                                            {Array.from({ length: 5 }).map(
                                                (_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        fill={
                                                            i < review.rating
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                        stroke="currentColor"
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {review.comment}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(
                                            review.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
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
