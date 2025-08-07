import ProductsList from "@/app/components/admin/ProductsList";
import { getSellerProduct } from "@/lib/actions/seller.action";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export const revalidate = 0;

const page = async () => {
    const session = await getSession();
    if (!session?.user.id) {
        redirect("/seller/login");
    }

    const products = await getSellerProduct(session?.user.id);

    return (
        <div>
            <ProductsList products={products} />
        </div>
    );
};

export default page;
