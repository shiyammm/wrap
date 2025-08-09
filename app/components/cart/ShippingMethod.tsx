import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { currency, shippingMethods } from "@/constants";
import React, { Dispatch, SetStateAction } from "react";

const ShippingMethod = ({
    shippingMethod,
    setShippingMethod
}: {
    shippingMethod: string;
    setShippingMethod: Dispatch<SetStateAction<string>>;
}) => {
    return (
        <div className="space-y-3">
            <Label>Shipping Method</Label>
            <Select value={shippingMethod} onValueChange={setShippingMethod}>
                <SelectTrigger className="w-full max-w-none data-[size=default]:h-auto">
                    <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent className="!h-auto">
                    {shippingMethods.map((method) => (
                        <SelectItem
                            key={method.id}
                            value={method.id}
                            className="!h-auto"
                        >
                            <div className="flex flex-col justify-between text-start">
                                <div className="font-medium">{method.name}</div>
                                <div className="text-muted-foreground text-sm">
                                    {method.estimatedDays}
                                </div>
                                <div className="font-medium">
                                    {currency}
                                    {method.price.toFixed(2)}
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default ShippingMethod;
