import React from "react";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteOrder } from "@/lib/actions/order.action";

type pageProps = Promise<{ orderId: string }>;

const CancelPage = async ({ searchParams }: { searchParams: pageProps }) => {
    const orderId = (await searchParams).orderId;

    if (orderId) {
        await deleteOrder(orderId);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-10">
            <XCircle className="w-20 h-20 text-red-500 mb-4" />
            <h1 className="text-3xl font-semibold text-red-700 mb-2">
                Payment Cancelled
            </h1>
            <p className="text-gray-600 mb-6">
                It looks like you canceled the payment. No charges were made.
            </p>

            <div className="space-x-4">
                <Button asChild>
                    <Link href="/cart">Go Back to Cart</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/shop">Continue Shopping</Link>
                </Button>
            </div>
        </div>
    );
};

export default CancelPage;
