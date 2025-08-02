"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    ColumnDef,
    flexRender,
    SortingState
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import { Category, OrderItem, Product } from "@/lib/generated/prisma";

type OrderRow = OrderItem & {
    product: Product & { category: Category };
};

type Props = {
    orders: OrderRow[];
};

export default function OrderList({ orders }: Props) {
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnFilters, setColumnFilters] = useState<any[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);

    const columns: ColumnDef<OrderRow>[] = [
        {
            accessorKey: "product.images",
            header: "Image",
            cell: ({ row }) => {
                const src = row.original.product.images?.[0];
                return src ? (
                    <Image
                        src={src}
                        alt={row.original.product.name}
                        width={60}
                        height={60}
                        className="rounded object-cover"
                    />
                ) : (
                    <div className="text-sm text-muted-foreground">
                        No Image
                    </div>
                );
            }
        },
        {
            accessorKey: "product.name",
            header: ({ column }) => (
                <SortableHeader label="Product Name" column={column} />
            ),
            cell: ({ row }) => row.original.product.name
        },
        {
            accessorKey: "quantity",
            header: ({ column }) => (
                <SortableHeader label="Quantity" column={column} />
            ),
            cell: ({ row }) => row.original.quantity
        },
        {
            accessorKey: "price",
            header: ({ column }) => (
                <SortableHeader label="Paid Price" column={column} />
            ),
            cell: ({ row }) => `₹${(row.original.price / 100).toFixed(2)}`
        },
        {
            accessorKey: "product.basePrice",
            header: ({ column }) => (
                <SortableHeader label="Base Price" column={column} />
            ),
            cell: ({ row }) =>
                `₹${(row.original.product.basePrice / 100).toFixed(2)}`
        },
        {
            accessorKey: "product.discountedPrice",
            header: ({ column }) => (
                <SortableHeader label="Discounted Price" column={column} />
            ),
            cell: ({ row }) =>
                row.original.product.discountedPrice
                    ? `₹${(row.original.product.discountedPrice / 100).toFixed(
                          2
                      )}`
                    : "—"
        },
        {
            accessorKey: "product.category.name",
            header: ({ column }) => (
                <SortableHeader label="Category" column={column} />
            ),
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.original.product.category.name}
                </div>
            )
        },
        {
            accessorKey: "product.inStock",
            header: ({ column }) => (
                <SortableHeader label="Stock Left" column={column} />
            ),
            cell: ({ row }) => row.original.product.inStock
        },
        {
            accessorKey: "product.isPublished",
            header: ({ column }) => (
                <SortableHeader label="Published" column={column} />
            ),
            cell: ({ row }) => (row.original.product.isPublished ? "Yes" : "No")
        }
    ];

    const table = useReactTable({
        data: orders,
        columns,
        state: {
            globalFilter,
            columnFilters,
            sorting
        },
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel()
    });

    return (
        <div className="space-y-4">
            <Input
                placeholder="Search orders..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="max-w-sm"
            />

            <Table>
                <TableCaption>A list of your order items.</TableCaption>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={columns.length}>
                            Total Items: {table.getRowModel().rows.length}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

function SortableHeader({ label, column }: { label: string; column: any }) {
    return (
        <div
            className="cursor-pointer flex items-center gap-2"
            onClick={() => column.toggleSorting()}
        >
            {label} {getSortIcon(column.getIsSorted())}
        </div>
    );
}

function getSortIcon(direction: false | "asc" | "desc") {
    if (direction === "asc") return <ArrowUp className="w-4 h-4" />;
    if (direction === "desc") return <ArrowDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4 opacity-30" />;
}
