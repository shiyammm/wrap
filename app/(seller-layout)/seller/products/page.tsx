import ProductsList from "@/app/components/admin/ProductsList";
import { getSellerProduct } from "@/lib/actions/seller.action";
import { getSession } from "@/lib/auth";
import React from "react";

const page = async () => {
    const session = await getSession();
    if (!session?.user.id) {
        return;
    }

    const products = await getSellerProduct(session?.user.id);

    return (
        <div>
            <ProductsList products={products} />
        </div>
    );
};

export default page;
