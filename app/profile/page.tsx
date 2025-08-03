import React from "react";
import { redirect } from "next/navigation";
import { getUserAddresses } from "@/lib/actions/address.action";
import { getUserReviews } from "@/lib/actions/common.action";
import { getUserOrders } from "@/lib/actions/order.action";
import { getSession } from "@/lib/auth";
import { currency } from "@/constants";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Address, Order, Product, Review } from "@/prisma/generated";

const ProfilePage = async () => {
    const session = await getSession();
    const user = session?.user;

    if (!user) return redirect("/login");

    const [addresses, orders, reviews] = await Promise.all([
        getUserAddresses(user.id),
        getUserOrders(user.id),
        getUserReviews(user.id)
    ]);

    return (
        <div className="container mx-auto py-10 px-4 space-y-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side: Orders & Reviews */}
                <div className="flex-1 space-y-6">
                    {/* Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">
                                🧾 My Orders
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {orders?.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No orders found.
                                </p>
                            ) : (
                                orders.map((order: Order) => (
                                    <div
                                        key={order.id}
                                        className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                                    >
                                        <p className="font-medium">
                                            Order #{order.id}
                                        </p>
                                        <p className="text-sm">
                                            Total: {currency}
                                            {(order.totalAmount / 100).toFixed(
                                                2
                                            )}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Status: {order.deliveryStatus}
                                        </p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Reviews */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">
                                ⭐ My Reviews
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {reviews?.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No reviews given yet.
                                </p>
                            ) : (
                                reviews.map(
                                    (review: Review & { product: Product }) => (
                                        <div
                                            key={review.id}
                                            className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                                        >
                                            <p className="font-medium">
                                                {review.product.name}
                                            </p>
                                            <p className="text-sm">
                                                {review.comment}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Rating: {review.rating}/5
                                            </p>
                                        </div>
                                    )
                                )
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Profile + Addresses */}
                <div className="lg:w-1/3 w-full space-y-6">
                    {/* Profile */}
                    <Card>
                        <CardHeader className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback>
                                    {user.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-lg font-semibold">
                                    {user.name}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Saved Addresses */}
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle className="text-lg font-semibold">
                                📍 Saved Addresses
                            </CardTitle>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/add-address">Add Address</Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {addresses?.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No addresses saved.
                                </p>
                            ) : (
                                addresses.map((addr: Address) => (
                                    <div
                                        key={addr.id}
                                        className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition flex justify-between gap-5"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {addr.firstName} {addr.lastName}
                                            </p>
                                            <p className="text-sm">
                                                {addr.street}, {addr.city},{" "}
                                                {addr.state}, {addr.zipcode}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {addr.phone}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/add-address?id=${addr.id}`}
                                        >
                                            <Button
                                                variant={"secondary"}
                                                className="cursor-pointer"
                                            >
                                                Edit
                                            </Button>
                                        </Link>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
