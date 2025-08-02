import React from "react";
import { redirect } from "next/navigation";
import { getUserAddresses } from "@/lib/actions/address.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getUserReviews } from "@/lib/actions/common.action";
import { getUserOrders } from "@/lib/actions/order.action";
import { currency } from "@/constants";
import { Address, Order, Product, Review } from "@/prisma/generated";

const ProfilePage = async () => {
    const session = await getSession();
    const user = session?.user;

    if (user?.id) return;

    if (!user) {
        return redirect("/login");
    }

    const [addresses, orders, reviews] = await Promise.all([
        getUserAddresses(user.id),
        getUserOrders(user.id),
        getUserReviews(user.id)
    ]);

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex gap-4">
                <div className="space-y-4 w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Orders</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {orders?.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No orders found.
                                </p>
                            ) : (
                                orders.map((order: Order) => (
                                    <div
                                        key={order.id}
                                        className="border rounded p-3"
                                    >
                                        <p className="font-medium">
                                            Order #{order.id}
                                        </p>
                                        <p className="text-sm">
                                            Total: {currency}{order.totalAmount / 100}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Status: {order.deliveryStatus}
                                        </p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>My Reviews</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {reviews?.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No reviews given yet.
                                </p>
                            ) : (
                                reviews.map(
                                    (review: Review & { product: Product }) => (
                                        <div
                                            key={review.id}
                                            className="border rounded p-3"
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
                </div>{" "}
                <div className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-6">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback>
                                    {user.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle>{user.name}</CardTitle>
                                <p className="text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle>Saved Addresses</CardTitle>
                            <Button asChild variant="outline">
                                <Link href="/profile/address/new">
                                    Add Address
                                </Link>
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
                                        className="border rounded p-4"
                                    >
                                        <p className="font-medium">
                                            {addr.firstName}
                                        </p>
                                        <p className="font-medium">
                                            {addr.lastName}
                                        </p>
                                        <p>
                                            {addr.street}, {addr.city},{" "}
                                            {addr.state}, {addr.zipcode}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {addr.phone}
                                        </p>
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
