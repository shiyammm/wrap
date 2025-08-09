import { currency } from "@/constants";
import React from "react";

const Subtotal = ({
    subtotal,
    shipping,
    total
}: {
    subtotal: number;
    shipping: number;
    total: number;
}) => {
    return (
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
    );
};

export default Subtotal;
