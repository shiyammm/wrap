"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { AddressSchema } from "@/lib/types";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    addUserAddress,
    getAddressById,
    updateUserAddress
} from "@/lib/actions/address.action";
import { SkeletonCard } from "./ui/SkeletonCard";

type AddressFormValues = z.infer<typeof AddressSchema>;

const AddAddress = ({ userId, id }: { userId: string; id: string }) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [addressId, setAddressId] = useState<string | null>(null);

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
        reset,
        formState: { errors }
    } = form;

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

    if (isLoading)
        return (
            <div className="text-center py-10 text-sm">
                <SkeletonCard />
            </div>
        );

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="john@example.com"
                                    type="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="123 Main Street"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                                <Input placeholder="NY" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="zipcode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Zipcode</FormLabel>
                            <FormControl>
                                <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                                <Input placeholder="USA" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="+1 123-456-7890"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="md:col-span-2 flex justify-end gap-4 pt-4 cursor-pointer">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">
                        {isPending ? "Saving Address..." : "Save Address"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default AddAddress;
