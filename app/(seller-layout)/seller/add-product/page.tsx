import React from "react";
import { getSession } from "@/lib/auth";
import AddProduct from "@/app/components/admin/AddProduct";
import { redirect } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

type paramsType = Promise<{ id: string }>;

const page = async ({ searchParams }: { searchParams: paramsType }) => {
    const session = await getSession();

    const userId = session?.user.id || "";

    if (!userId) redirect("/login");

    const id = (await searchParams).id;

    return (
        <>
            <div className="container max-w-3xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Product</CardTitle>
                        <CardDescription>
                            Enter product details and upload images to add a new
                            listing.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <AddProduct userId={userId} id={id} />
                    </CardContent>
                </Card>
            </div>{" "}
        </>
    );
};

export default page;
