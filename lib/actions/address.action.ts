"use server";

import { prisma } from "../auth";
import { AddressSchema } from "../types";
import * as z from "zod";

type AddressFormValues = z.infer<typeof AddressSchema>;

export const addUserAddress = async (
    values: AddressFormValues,
    userId: string
) => {
    const {
        city,
        country,
        email,
        firstName,
        lastName,
        phone,
        state,
        street,
        zipcode
    } = values;

    const addressResponse = await prisma.address.create({
        data: {
            city,
            country,
            email,
            firstName,
            lastName,
            phone,
            state,
            street,
            zipcode,
            userId
        }
    });

    if (!addressResponse) {
        throw new Error("Failed to add item to cart");
    }

    return addressResponse;
};

export const getUserAddresses = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { addresses: true }
        });

        if (!user) {
            throw new Error("User not found");
        }

        return user.addresses ?? [];
    } catch (error) {
        console.error("Error fetching user addresses:", error);
        throw new Error("Failed to retrieve user addresses");
    }
};

export const selectUserAddress = async (userId: string, addressId: string) => {
    await prisma.address.updateMany({
        where: { userId },
        data: { isSelected: false }
    });

    const updated = await prisma.address.update({
        where: { id: addressId },
        data: { isSelected: true }
    });

    return updated;
};
