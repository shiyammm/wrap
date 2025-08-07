"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { DeleteProductModel } from "./DeleteProductModel";

export function ActionsButton({
    productId,
    onDeleted
}: {
    productId: string;
    onDeleted: () => void;
}) {
    const [openDelete, setOpenDelete] = useState(false);

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <Ellipsis />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-20" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Link href={`/seller/add-product?id=${productId}`}>
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpenDelete(true)}>
                            <div className="text-red-600">Delete</div>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {openDelete && (
                <DeleteProductModel
                    productId={productId}
                    setOpenDelete={setOpenDelete}
                    onDeleted={onDeleted}
                />
            )}
        </div>
    );
}
