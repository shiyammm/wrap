"use server";

import { prisma } from "../auth";

export const checkExistingUser = async (email: string) => {
    const res = await prisma.user.findUnique({
        where: { email }
    });

    if (res?.email === email) {
        return { success: false, message: "User already exists" };
    }

    return { success: true, message: "User does not exist" };
};

export const getUserReviews = async (userId: string) => {
    const reviews = await prisma.review.findMany({
        where: { userId },
        include: {
            product: true
        }
    });

    if (!reviews) {
        throw new Error("Failed to get reviews");
    }

    return reviews;
};
