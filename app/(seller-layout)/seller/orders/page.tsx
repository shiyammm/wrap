import OrderList from "@/app/components/admin/OrderList";
import { getSellerOrders } from "@/lib/actions/seller.action";
import { getSession } from "@/lib/auth";
import React from "react";

const page = async () => {
    const session = await getSession();

    if (!session?.user.id) return;

    const orders = await getSellerOrders(session.user.id);

    return (
        <div>
            <OrderList orders={orders} />
        </div>
    );
};

export default page;
