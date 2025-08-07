import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { deleteProduct } from "@/lib/actions/seller.action";
import { Product } from "@/prisma/generated";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function DeleteProductModel({
    productId,
    setOpenDelete,
    onDeleted
}: {
    productId: string;
    setOpenDelete: Dispatch<SetStateAction<boolean>>;
    onDeleted: () => void;
}) {
    const [productDetail, setProductDetail] = useState<Product | null>(null);

    const fetchProductToDelete = async (productId: string) => {
        const data = await deleteProduct(productId);
        setProductDetail(data);
    };

    useEffect(() => {
        fetchProductToDelete(productId);
    }, [productId]);

    return (
        <Dialog open onOpenChange={setOpenDelete}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Product</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this product?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="text-sm text-gray-500">
                            {productDetail?.name ??
                                "Product details loading..."}
                        </Label>
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={async () => {
                            await deleteProduct(productId, true);
                            setOpenDelete(false);
                            onDeleted();
                        }}
                    >
                        Confirm Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
