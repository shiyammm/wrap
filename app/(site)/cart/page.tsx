import Cart from "@/app/components/cart/Cart";
import { getSession } from "@/lib/auth";
import { User } from "@/prisma/generated";
import React from "react";

const CartPage = async () => {
    const session = await getSession();

    return (
        <div>
            <Cart user={session?.user as User} />
        </div>
    );
};

export default CartPage;
