import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useOrder from "@/hooks/use-order";
import { useSession } from "@/lib/auth-client";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

const AddressBlock = () => {
    const { addresses, selectedAddressId, updateSelectedAddress, isLoading } =
        useOrder();

    const { data } = useSession();

    return (
        <div className="space-y-2">
            <Label>Shipping Address</Label>

            {isLoading ? (
                <p className="text-sm text-muted-foreground">
                    Getting your address...
                </p>
            ) : addresses.length > 0 ? (
                <RadioGroup
                    value={selectedAddressId}
                    onValueChange={(id) => {
                        if (!data?.user?.id) return;
                        updateSelectedAddress(data?.user.id, id);
                    }}
                    className="space-y-4 mt-5"
                >
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className="flex items-start space-x-2"
                        >
                            <RadioGroupItem value={addr.id} />
                            <div className="text-sm leading-tight">
                                <p>{addr.street}</p>
                                <p>
                                    {addr.city}, {addr.state} {addr.zipcode}
                                </p>
                                <p>{addr.country}</p>
                                <p>{addr.phone}</p>
                            </div>
                        </div>
                    ))}
                </RadioGroup>
            ) : (
                <p className="text-muted-foreground text-sm">
                    No address found. Please add a shipping address.
                </p>
            )}

            <Link href="/add-address">
                <Button
                    variant="outline"
                    className="text-sm text-primary px-0 w-full mt-3"
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Address
                </Button>
            </Link>
        </div>
    );
};

export default AddressBlock;
