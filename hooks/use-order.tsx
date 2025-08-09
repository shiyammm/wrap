"use client";

import { shippingMethods } from "@/constants";
import {
    getUserAddresses,
    selectUserAddress
} from "@/lib/actions/address.action";
import { useSession } from "@/lib/auth-client";
import { Address, PaymentMethod, User } from "@/prisma/generated";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const useOrder = () => {
    const { data } = useSession();

    const user = data?.user;

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
        PaymentMethod.COD
    );
    const [isLoading, setIsLoading] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
        null
    );

    const [wrappingOption, setWrappingOption] = useState("none");
    const showMessageBox =
        wrappingOption === "basic" || wrappingOption === "premium";
    const [message, setMessage] = useState("");

    const [shippingMethod, setShippingMethod] = useState<string>("standard");

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

    useEffect(() => {
        const fetchAddress = async () => {
            if (!user?.id) return;

            setIsLoading(true);

            try {
                const addresses = await getUserAddresses(user.id);
                setAddresses(addresses);

                const selected = addresses.find((addr) => addr.isSelected);
                if (selected) {
                    setSelectedAddressId(selected.id);
                }
            } catch (error) {
                toast.error("Failed to fetch addresses");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddress();
    }, [user?.id]);

    return {
        paymentMethod,
        addresses,
        selectedAddressId,
        message,
        shippingMethod,
        shippingMethods,
        showMessageBox,
        wrappingOption,
        isLoading,
        setAddresses,
        setPaymentMethod,
        setIsLoading,
        setSelectedAddressId,
        setShippingMethod,
        setMessage,
        setWrappingOption,
        updateSelectedAddress
    };
};

export default useOrder;
