"use client";

import React, { useState } from "react";
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
    SortingState,
    ColumnFiltersState
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, ArrowDown, ArrowUp, Pencil } from "lucide-react";
import Image from "next/image";
import { Category, Product, Review } from "@/prisma/generated";
import Link from "next/link";

type ExtendedProduct = Product & {
    category: Category;
    reviews: Review[];
};

type Props = {
    products: ExtendedProduct[];
};

export default function ProductsList({ products }: Props) {
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);

    const columns: ColumnDef<ExtendedProduct>[] = [
        {
            accessorKey: "images",
            header: "Image",
            cell: ({ row }) => {
                const src = row.original.images?.[0];
                return src ? (
                    <Image
                        src={src}
                        alt={row.original.name}
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
            accessorKey: "name",
            header: ({ column }) => (
                <div
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => column.toggleSorting()}
                >
                    Name {getSortIcon(column.getIsSorted())}
                </div>
            ),
            cell: ({ row }) => row.original.name
        },
        {
            accessorKey: "basePrice",
            header: ({ column }) => (
                <div
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => column.toggleSorting()}
                >
                    Price {getSortIcon(column.getIsSorted())}
                </div>
            ),
            cell: ({ row }) => `₹${(row.original.basePrice / 100).toFixed(2)}`
        },
        {
            accessorKey: "discountedPrice",
            header: ({ column }) => (
                <div
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => column.toggleSorting()}
                >
                    Discounted Price {getSortIcon(column.getIsSorted())}
                </div>
            ),
            cell: ({ row }) =>
                row.original.discountedPrice
                    ? `₹${(row.original.discountedPrice / 100).toFixed(2)}`
                    : "—"
        },
        {
            accessorKey: "category.name",
            header: ({ column }) => (
                <div
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => column.toggleSorting()}
                >
                    Category {getSortIcon(column.getIsSorted())}
                </div>
            ),
            cell: ({ row }) => {
                return (
                    <div className="capitalize">
                        {row.original.category.name}
                    </div>
                );
            }
        },
        {
            accessorKey: "inStock",
            header: ({ column }) => (
                <div
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => column.toggleSorting()}
                >
                    Stock {getSortIcon(column.getIsSorted())}
                </div>
            ),
            cell: ({ row }) => row.original.inStock
        },
        {
            accessorKey: "rating",
            header: ({ column }) => (
                <div
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => column.toggleSorting()}
                >
                    Rating {getSortIcon(column.getIsSorted())}
                </div>
            ),
            sortingFn: (a, b) => {
                const avgA =
                    a.original.reviews.reduce(
                        (acc, r) => acc + (r.rating ?? 0),
                        0
                    ) / (a.original.reviews.length || 1);
                const avgB =
                    b.original.reviews.reduce(
                        (acc, r) => acc + (r.rating ?? 0),
                        0
                    ) / (b.original.reviews.length || 1);
                return avgA - avgB;
            },
            cell: ({ row }) => {
                const reviews = row.original.reviews;
                const avg =
                    reviews.length > 0
                        ? (
                              reviews.reduce(
                                  (sum, r) => sum + (r.rating || 0),
                                  0
                              ) / reviews.length
                          ).toFixed(1)
                        : "N/A";
                return <div>{avg}</div>;
            }
        },
        {
            accessorKey: "isPublished",
            header: ({ column }) => (
                <div
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => column.toggleSorting()}
                >
                    Published {getSortIcon(column.getIsSorted())}
                </div>
            ),
            cell: ({ row }) => (row.original.isPublished ? "Yes" : "No")
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <Link
                        href={`/seller/add-product?id=${product.id}`}
                        className="text-sm text-blue-600 hover:underline flex items-center gap-2"
                    >
                        Edit
                    </Link>
                );
            }
        }
    ];

    const table = useReactTable({
        data: products,
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
                placeholder="Search products..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="max-w-sm"
            />

            <Table>
                <TableCaption>A list of your products.</TableCaption>
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
                            Total Products: {table.getRowModel().rows.length}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}

function getSortIcon(direction: false | "asc" | "desc") {
    if (direction === "asc") return <ArrowUp className="w-4 h-4" />;
    if (direction === "desc") return <ArrowDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4 opacity-30" />;
}
