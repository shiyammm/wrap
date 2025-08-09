import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { paymentMethods } from "@/constants";
import { PaymentMethod } from "@/prisma/generated";
import React, { Dispatch, SetStateAction } from "react";

interface PaymentProps {
    paymentMethod: PaymentMethod;
    setPaymentMethod: Dispatch<SetStateAction<PaymentMethod>>;
}

const PaymentOption = ({ paymentMethod, setPaymentMethod }: PaymentProps) => {
    return (
        <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select
                value={paymentMethod}
                onValueChange={(val: string) =>
                    setPaymentMethod(val as PaymentMethod)
                }
            >
                <SelectTrigger className="w-full max-w-none data-[size=default]:h-auto">
                    <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent className="!h-auto">
                    {paymentMethods.map((method) => (
                        <SelectItem
                            key={method}
                            value={method}
                            className="!h-auto"
                        >
                            <div className="flex flex-col justify-between text-start">
                                <div className="font-medium">{method}</div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default PaymentOption;
