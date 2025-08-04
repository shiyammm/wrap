import Cart from "@/app/components/cart/Cart";
import { getSession } from "@/lib/auth";
import React from "react";

const CartPage = async () => {
    const session = await getSession();

    return (
        <div>
            <Cart user={session?.user ?? null} />
        </div>
    );
};

export default CartPage;
