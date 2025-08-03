"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import {
    addUserAddress,
    getAddressById,
    updateUserAddress
} from "@/lib/actions/address.action";
import { AddressSchema } from "@/lib/types";
import * as z from "zod";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useEffect, useState, useTransition } from "react";
import AddAddress from "../components/AddAddress";

type AddressFormValues = z.infer<typeof AddressSchema>;

const AddAddressPage = () => {
    const { data } = useSession();
    const userId = data?.user.id || "";
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [addressId, setAddressId] = useState<string | null>(null);
    const searchParams = useSearchParams();

    const id = searchParams.get("id");

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(AddressSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            street: "",
            city: "",
            state: "",
            zipcode: "",
            country: "",
            phone: ""
        }
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = form;

    useEffect(() => {
        const fetchAddress = async () => {
            if (!id) {
                setIsLoading(false);
                return;
            }

            try {
                const existingAddress = await getAddressById(id);
                if (existingAddress) {
                    reset(existingAddress);
                    setAddressId(existingAddress.id);
                }
            } catch (error) {
                console.error("Error fetching address:", error);
                toast.error("Failed to fetch address for editing.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddress();
    }, [id]);

    const onSubmit = async (values: AddressFormValues) => {
        startTransition(async () => {
            try {
                if (!userId) {
                    toast.error("Login to add address");
                }

                if (addressId) {
                    await updateUserAddress(addressId, values);
                    toast.success("Address updated successfully!");
                } else {
                    await addUserAddress(values, userId);
                    toast.success("Address added successfully!");
                }

                setTimeout(() => {
                    router.push("/profile");
                }, 500);
            } catch (error) {
                console.error("Failed to submit address:", error);
            }
        });
    };

    if (isLoading)
        return (
            <p className="text-center py-10 text-sm">
                Redirecting to address page...
            </p>
        );

    return (
        <div className="container mx-auto max-w-3xl py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Address</CardTitle>
                    <CardDescription>
                        Fill in your shipping details below.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <AddAddress
                        form={form}
                        onSubmit={onSubmit}
                        isPending={isPending}
                        router={router}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default AddAddressPage;
