"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    getCartItems,
    removeCartItem,
    updateCartItem
} from "@/lib/actions/cart.action";
import {
    Trash2,
    Plus,
    Minus,
    Package,
    CreditCard,
    Truck,
    Shield,
    PlusCircle
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { currency, WrappingOptions } from "@/constants";
import { SkeletonCard } from "../ui/SkeletonCard";
import { CartItem, Product, User } from "@/prisma/generated";
import { useCheckout } from "@/hooks/use-checkout";
import useOrder from "@/hooks/use-order";
import GiftWrap from "./GiftWrap";
import PaymentOption from "./PaymentOption";
import Subtotal from "./Subtotal";
import ShippingMethod from "./ShippingMethod";
import AddressBlock from "./AddressBlock";

export interface CartItemWithProduct extends CartItem {
    product: Product;
}

export default function Cart({ user }: { user: User }) {
    const [items, setItems] = useState<CartItemWithProduct[] | []>([]);

    const {
        paymentMethod,
        addresses,
        selectedAddressId,
        message,
        wrappingOption,
        shippingMethod,
        shippingMethods,
        showMessageBox,
        isLoading,
        setPaymentMethod,
        setIsLoading,
        setShippingMethod,
        setMessage,
        setWrappingOption,
        updateSelectedAddress
    } = useOrder();

    let subtotal = 0;

    if (items && items.length > 0) {
        subtotal = items.reduce((sum, item) => {
            const priceInPaise =
                item.product.discountedPrice ?? item.product.basePrice;
            const totalForItem = (priceInPaise * item.quantity) / 100;
            return sum + totalForItem;
        }, 0);
    }

    const shipping =
        shippingMethods.find((m) => m.id === shippingMethod)?.price || 0;

    const giftWrappingCost =
        WrappingOptions.find((option) => option.id === wrappingOption)?.price ||
        0;

    const total = subtotal + shipping + giftWrappingCost;

    const { proceedToCheckout, isPending } = useCheckout<CartItemWithProduct>({
        selectedAddressId,
        paymentMethod,
        total,
        shippingMethod,
        wrappingOption,
        message,
        setItems
    });

    useEffect(() => {
        const fetchCart = async () => {
            if (!user?.id) return;

            setIsLoading(true);
            const cartItem = await getCartItems(user.id);
            if (cartItem) {
                setItems(cartItem);
                setIsLoading(false);
            }
        };
        fetchCart();
    }, [user?.id]);

    const updateQuantity = async (id: string, change: number) => {
        const item = items.find((i) => i.id === id);
        if (!item) return;

        const newQuantity = item.quantity + change;

        if (newQuantity <= 0) {
            setItems((prev) => prev.filter((i) => i.id !== id));

            try {
                const removed = await removeCartItem(id);
                if (!removed) throw new Error("Failed to remove cart item");
                toast.success("Item removed from cart");
            } catch (err) {
                console.error(err);
                toast.error("Error removing item");
            }
        } else {
            setItems((prev) =>
                prev.map((i) =>
                    i.id === id ? { ...i, quantity: newQuantity } : i
                )
            );

            try {
                const updated = await updateCartItem(id, newQuantity);
                if (!updated) throw new Error("Failed to update cart item");
            } catch (err) {
                console.error(err);
                toast.error("Error updating item");
            }
        }
    };

    const removeItem = async (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
        await removeCartItem(id);
        toast.success("Item removed from cart successfully");
    };

    useEffect(() => {
        if (addresses.length === 1 && !selectedAddressId && user?.id) {
            updateSelectedAddress(user.id, addresses[0].id);
        }
    }, [addresses, selectedAddressId, user?.id]);

    return (
        <div className="mx-auto w-full max-w-7xl p-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div>
                        <h1 className="text-lg font-semibold">
                            Shopping Cart{" "}
                        </h1>
                        <p
                            className={`text-muted-foreground text-sm ${
                                isLoading && "hidden"
                            }`}
                        >
                            {items.length}{" "}
                            {items.length === 1 ? "item" : "items"} in your cart
                        </p>
                    </div>

                    {isLoading && <SkeletonCard />}

                    <div className="space-y-4">
                        {items.map((item) => (
                            <Card key={item.id} className="overflow-hidden p-0">
                                <CardContent className="p-0">
                                    <div className="flex h-full flex-col md:flex-row">
                                        <div className="relative h-auto w-full md:w-32">
                                            <Image
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                width={500}
                                                height={500}
                                                className="h-full w-full object-cover md:w-32"
                                            />
                                        </div>

                                        <div className="flex-1 p-6 pb-3">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="font-medium  text-sm">
                                                        {item.product.name}
                                                    </h3>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        removeItem(item.id)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                -1
                                                            )
                                                        }
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                1
                                                            )
                                                        }
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="text-right">
                                                    <div className="font-medium">
                                                        {currency}
                                                        {item.product
                                                            .discountedPrice !==
                                                            null &&
                                                            (item.product
                                                                .discountedPrice /
                                                                100) *
                                                                item.quantity}
                                                    </div>
                                                    {item.product.basePrice && (
                                                        <div className="text-muted-foreground text-sm line-through">
                                                            {currency}
                                                            {(
                                                                (item.product
                                                                    .basePrice /
                                                                    100) *
                                                                item.quantity
                                                            ).toFixed(2)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                            <CardDescription>
                                Review your order details and shipping
                                information
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <AddressBlock />
                            {items.length > 0 && (
                                <>
                                    <ShippingMethod
                                        setShippingMethod={setShippingMethod}
                                        shippingMethod={shippingMethod}
                                    />
                                    <GiftWrap
                                        message={message}
                                        setMessage={setMessage}
                                        setWrappingOption={setWrappingOption}
                                        showMessageBox={showMessageBox}
                                        wrappingOption={wrappingOption}
                                    />
                                    <PaymentOption
                                        paymentMethod={paymentMethod}
                                        setPaymentMethod={setPaymentMethod}
                                    />
                                    <Subtotal
                                        shipping={shipping}
                                        subtotal={subtotal}
                                        total={total}
                                    />
                                    <div className="space-y-4 border-t pt-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Package className="text-primary h-4 w-4" />
                                            <span>
                                                Free returns within 30 days
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Shield className="text-primary h-4 w-4" />
                                            <span>Secure payment</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Truck className="text-primary h-4 w-4" />
                                            <span>Fast delivery</span>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full cursor-pointer"
                                        onClick={proceedToCheckout}
                                    >
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        {isPending
                                            ? "Proceeding to checkout..."
                                            : "Proceed to Checkout"}
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
