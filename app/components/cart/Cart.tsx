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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    clearCart,
    getCartItems,
    getCartProductsToMakePayment,
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
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import {
    getUserAddresses,
    selectUserAddress
} from "@/lib/actions/address.action";
import { useRouter } from "next/navigation";
import { getOrderById } from "@/lib/actions/order.action";
import { currency, predefinedMessages, WrappingOptions } from "@/constants";
import { SkeletonCard } from "../ui/SkeletonCard";
import {
    Address,
    CartItem,
    OrderItem,
    PaymentMethod,
    Product,
    User
} from "@/prisma/generated";
import { createCheckoutSession } from "@/lib/actions/checkout.action";
import clsx from "clsx";
import { Textarea } from "@/components/ui/textarea";

interface ShippingMethod {
    id: string;
    name: string;
    price: number;
    estimatedDays: string;
    description: string;
}

interface CartItemWithProduct extends CartItem {
    product: Product;
}
type CartProps = {
    user: {
        id: string;
        email: string;
        name: string;
    } | null;
};

export default function Cart({ user }: CartProps) {
    const [items, setItems] = useState<CartItemWithProduct[] | []>([]);
    const router = useRouter();
    const paymentMethods = ["COD", "CARD"];
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
        PaymentMethod.COD
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [addresses, setAddresses] = useState<Address[]>([]);

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
        null
    );

    const [wrappingOption, setWrappingOption] = useState("none");
    const showMessageBox =
        wrappingOption === "basic" || wrappingOption === "premium";
    const [message, setMessage] = useState("");

    const [shippingMethod, setShippingMethod] = useState<string>("standard");

    const shippingMethods: ShippingMethod[] = [
        {
            id: "standard",
            name: "Standard Shipping",
            price: 50,
            estimatedDays: "3-5 days",
            description: `Free shipping on orders over ${currency}500`
        },
        {
            id: "express",
            name: "Express Shipping",
            price: 100,
            estimatedDays: "1-2 days",
            description: "Priority delivery with tracking"
        }
    ];

    useEffect(() => {
        const fetchAddress = async () => {
            if (!user?.id) return;

            const addresses = await getUserAddresses(user.id);
            setAddresses(addresses);

            const selected = addresses.find((addr) => addr.isSelected);
            if (selected) {
                setSelectedAddressId(selected.id);
            }
        };

        fetchAddress();
    }, [user?.id]);

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

    const updateSelectedAddress = async (userId: string, addressId: string) => {
        try {
            toast.loading("Updating the selected address...", {
                id: "update-address"
            });

            const updated = await selectUserAddress(userId, addressId);
            if (updated) {
                setSelectedAddressId(addressId);
                toast.success("Address updated", { id: "update-address" });
            } else {
                toast.error("Failed to update address");
            }
        } catch (error) {
            toast.error(`Something went wrong ${error}`);
        }
    };

    const proceedToCheckout = async () => {
        if (
            !user?.id ||
            !selectedAddressId ||
            !paymentMethod ||
            !total ||
            !shippingMethod ||
            !wrappingOption
        ) {
            toast.error("Missing checkout information.");
            return;
        }
        startTransition(async () => {
            try {
                const order = await getCartProductsToMakePayment(
                    user.id,
                    selectedAddressId,
                    paymentMethod,
                    total,
                    shippingMethod,
                    wrappingOption,
                    message
                );

                if (paymentMethod === "CARD") {
                    const metaData = {
                        orderId: order.id,
                        customerName: user?.name,
                        customerEmail: user?.email,
                        userId: user?.id
                    };

                    const orderDetails = await getOrderById(order.id);

                    const response = await fetch(
                        "/api/create-checkout-session",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                items: orderDetails.orderItems.map(
                                    (
                                        item: OrderItem & { product: Product }
                                    ) => ({
                                        name: item.product.name,
                                        amount: item.price,
                                        quantity: item.quantity,
                                        productId: item.productId,
                                        images: item.product.images,
                                        shippingMethod:
                                            orderDetails.shippingMethod,
                                        wrappingOption:
                                            orderDetails.wrappingOption
                                    })
                                ),
                                metaData
                            })
                        }
                    );

                    const result = await response.json();

                    if (result.url) {
                        router.push(result.url);
                    }
                } else {
                    await clearCart(user?.id);
                    setItems([]);
                    toast.success("Order placed successfully");
                    router.refresh();
                }
            } catch (error) {
                toast.error("Checkout failed.");
                console.error(error);
            }
        });
    };

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
                            <div className="space-y-2">
                                <Label>Shipping Address</Label>
                                {addresses.length > 0 ? (
                                    <RadioGroup
                                        value={selectedAddressId}
                                        onValueChange={(id) => {
                                            if (!user?.id) return;
                                            updateSelectedAddress(user.id, id);
                                        }}
                                        className="space-y-4 mt-5"
                                    >
                                        {addresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                className="flex items-start space-x-2"
                                            >
                                                <RadioGroupItem
                                                    value={addr.id}
                                                />
                                                <div className="text-sm leading-tight">
                                                    <p>{addr.street}</p>
                                                    <p>
                                                        {addr.city},{" "}
                                                        {addr.state}{" "}
                                                        {addr.zipcode}
                                                    </p>
                                                    <p>{addr.country}</p>
                                                    <p>{addr.phone}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                ) : (
                                    <p className="text-muted-foreground text-sm">
                                        No address found. Please add a shipping
                                        address.
                                    </p>
                                )}

                                <Link href="/add-address">
                                    <Button
                                        variant="outline"
                                        className="text-sm text-primary px-0 w-full mt-3"
                                    >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Address
                                    </Button>
                                </Link>
                            </div>
                            {items.length > 0 && (
                                <>
                                    <div className="space-y-2">
                                        <Label>Shipping Method</Label>
                                        <Select
                                            value={shippingMethod}
                                            onValueChange={setShippingMethod}
                                        >
                                            <SelectTrigger className="w-full max-w-none data-[size=default]:h-auto">
                                                <SelectValue placeholder="Select shipping method" />
                                            </SelectTrigger>
                                            <SelectContent className="!h-auto">
                                                {shippingMethods.map(
                                                    (method) => (
                                                        <SelectItem
                                                            key={method.id}
                                                            value={method.id}
                                                            className="!h-auto"
                                                        >
                                                            <div className="flex flex-col justify-between text-start">
                                                                <div className="font-medium">
                                                                    {
                                                                        method.name
                                                                    }
                                                                </div>
                                                                <div className="text-muted-foreground text-sm">
                                                                    {
                                                                        method.estimatedDays
                                                                    }
                                                                </div>
                                                                <div className="font-medium">
                                                                    {currency}
                                                                    {method.price.toFixed(
                                                                        2
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-5">
                                        <Label>Select Gift Wrapping</Label>
                                        <RadioGroup
                                            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                                            value={wrappingOption}
                                            onValueChange={(value) =>
                                                setWrappingOption(value)
                                            }
                                        >
                                            {WrappingOptions.map((option) => (
                                                <div
                                                    key={option.id}
                                                    className={clsx(
                                                        "relative rounded-lg overflow-hidden border transition cursor-pointer",
                                                        option.id ==
                                                            wrappingOption
                                                            ? "border-wrap-orange-dull ring-2 ring-wrap-orange-dull"
                                                            : "border-muted hover:border-wrap-orange"
                                                    )}
                                                >
                                                    <RadioGroupItem
                                                        value={option.id}
                                                        className={`hidden`}
                                                        id={option.id}
                                                    />
                                                    <label
                                                        htmlFor={option.id}
                                                        className="block cursor-pointer"
                                                    >
                                                        <Image
                                                            src={option.image}
                                                            alt={option.name}
                                                            width={300}
                                                            height={300}
                                                            className="w-full h-32 object-cover"
                                                        />
                                                        <div className="text-center py-2 text-[0.8rem] font-medium">
                                                            {option.name}
                                                        </div>
                                                    </label>
                                                </div>
                                            ))}
                                        </RadioGroup>

                                        {showMessageBox && (
                                            <div className="space-y-2">
                                                <Label>Gift Message</Label>
                                                <Textarea
                                                    placeholder="Write your personal message..."
                                                    value={message}
                                                    onChange={(e) =>
                                                        setMessage(
                                                            e.target.value
                                                        )
                                                    }
                                                    rows={4}
                                                />

                                                <div className="flex gap-2 flex-wrap mt-2">
                                                    {predefinedMessages.map(
                                                        (msg, idx) => (
                                                            <button
                                                                key={idx}
                                                                type="button"
                                                                onClick={() =>
                                                                    setMessage(
                                                                        msg
                                                                    )
                                                                }
                                                                className="text-sm bg-muted px-3 py-1.5 rounded hover:bg-accent"
                                                            >
                                                                {msg}
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label>Gift Wrapping</Label>
                                            <Select
                                                value={wrappingOption}
                                                onValueChange={(value) =>
                                                    setWrappingOption(value)
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a wrapping option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">
                                                        🎁 No Wrapping (Free)
                                                    </SelectItem>
                                                    <SelectItem value="basic">
                                                        ✨ Basic Wrap - ₹20
                                                    </SelectItem>
                                                    <SelectItem value="premium">
                                                        🌟 Premium Wrap with
                                                        Ribbon - ₹50
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Payment Method</Label>
                                        <Select
                                            value={paymentMethod}
                                            onValueChange={(val: string) =>
                                                setPaymentMethod(
                                                    val as PaymentMethod
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-full max-w-none data-[size=default]:h-auto">
                                                <SelectValue placeholder="Select shipping method" />
                                            </SelectTrigger>
                                            <SelectContent className="!h-auto">
                                                {paymentMethods.map(
                                                    (method) => (
                                                        <SelectItem
                                                            key={method}
                                                            value={method}
                                                            className="!h-auto"
                                                        >
                                                            <div className="flex flex-col justify-between text-start">
                                                                <div className="font-medium">
                                                                    {method}
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Subtotal</span>
                                            <span>
                                                {currency}
                                                {subtotal.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Shipping</span>
                                            <span>
                                                {currency}
                                                {shipping.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between font-medium">
                                            <span>Total</span>
                                            <span>
                                                {currency}
                                                {total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

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
