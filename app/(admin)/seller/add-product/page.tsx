import React from "react";
import { getSession } from "@/lib/auth";
import AddProduct from "@/app/components/admin/AddProduct";
import { redirect } from "next/navigation";

const page = async () => {
    const session = await getSession();

    if (!session?.user.id) {
        redirect("/");
    }
    
    return (
        <>
            <AddProduct userId={session?.user.id} />
        </>
    );
};

export default page;
