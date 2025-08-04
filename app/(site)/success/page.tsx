import React from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { setPaymentSuccess } from "@/lib/actions/order.action";
import { toast } from "sonner";
import SuccessClient from "@/app/components/SuccessClient";

type pageProps = Promise<{ orderId: string }>;

const SuccessPage = async ({ searchParams }: { searchParams: pageProps }) => {
    const orderId = (await searchParams).orderId;

    console.log(orderId);

    let statusMessage = "";
    let isSuccess = false;

    if (orderId) {
        const res = await setPaymentSuccess(orderId);
        statusMessage = res.message;
        isSuccess = res.success;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-10">
            <CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
            <h1 className="text-3xl font-semibold text-green-700 mb-2">
                Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6">
                Thank you for your purchase.
                {orderId && (
                    <>
                        <br />
                        Your order ID is{" "}
                        <span className="font-medium">{orderId}</span>.
                    </>
                )}
            </p>

            <SuccessClient message={statusMessage} success={isSuccess} />

            <div className="space-x-4">
                <Button asChild>
                    <Link href="/profile">Go to My Orders</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/shop">Continue Shopping</Link>
                </Button>
            </div>
        </div>
    );
};

export default SuccessPage;
