import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AddAddress from "@/app/components/AddAddress";

type paramsType = Promise<{ id: string }>;

const AddAddressPage = async ({
    searchParams
}: {
    searchParams: paramsType;
}) => {
    const session = await getSession();

    const userId = session?.user.id || "";

    if (!userId) redirect("/login");

    const id = (await searchParams).id;

    return (
        <div className="container mx-auto max-w-3xl py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Address</CardTitle>
                    <CardDescription>
                        Fill in your shipping details below.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <AddAddress userId={userId} id={id} />
                </CardContent>
            </Card>
        </div>
    );
};

export default AddAddressPage;
