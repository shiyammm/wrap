"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import Image from "next/image";
import { toast } from "sonner";
import { upload } from "@imagekit/next";
import { authenticator } from "@/lib/helpers";
import {
    addProduct,
    getProductByIdToUpdate,
    updateProduct
} from "@/lib/actions/seller.action";
import { productSchema } from "@/lib/validation";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CategorySelect } from "./Categories";
import imagePlaceholder from "@/public/upload_area.png";
import { SkeletonCard } from "../ui/SkeletonCard";

type ProductFormValues = z.infer<typeof productSchema>;

const AddProduct = ({ userId, id }: { userId: string; id: string }) => {
    const [isPending, startTransition] = useTransition();
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const router = useRouter();
    const [productId, setProductId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            category: "",
            basePrice: 0,
            discountedPrice: 0,
            inStock: 0,
            isPublished: false
        }
    });

    const {
        reset,
        formState: { errors }
    } = form;

    const handleImageChange = (files: FileList | null) => {
        if (!files) return;

        const newFiles = Array.from(files).filter(
            (file) =>
                !images.some(
                    (img) => img.name === file.name && img.size === file.size
                )
        );

        const newPreviewUrls = newFiles.map((file) =>
            URL.createObjectURL(file)
        );

        setImages((prev) => [...prev, ...newFiles]);
        setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    };

    const onSubmit = async (values: ProductFormValues) => {
        if (!images.length && !existingImageUrls.length) {
            toast.error("Please select at least one image");
            return;
        }

        startTransition(async () => {
            try {
                const uploadedUrls: string[] = [...existingImageUrls];

                await Promise.all(
                    images.map(async (file) => {
                        const { signature, expire, token, publicKey } =
                            await authenticator();
                        const imageData = await upload({
                            file,
                            fileName: file.name,
                            expire,
                            token,
                            signature,
                            publicKey
                        });
                        if (imageData?.url) uploadedUrls.push(imageData.url);
                    })
                );

                let res;
                if (productId) {
                    res = await updateProduct(productId, values, uploadedUrls);
                    toast.success("Product updated successfully");
                } else {
                    res = await addProduct(values, userId, uploadedUrls);
                    toast.success("Product added successfully");
                }

                if (res) {
                    router.push("/seller/products");
                } else {
                    toast.error("Failed to save product");
                }
            } catch (error) {
                toast.error("Unexpected error. Please try again later.");
                console.error(error);
            }
        });
    };

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                setIsLoading(false);
                return;
            }

            try {
                const existingProduct = await getProductByIdToUpdate(id);

                const {
                    category,
                    name,
                    basePrice,
                    description,
                    discountedPrice,
                    images: serverImages,
                    inStock,
                    isPublished
                } = existingProduct.product;

                if (existingProduct.product.id) {
                    reset({
                        category,
                        name,
                        basePrice: basePrice ? basePrice / 100 : 0,
                        description,
                        discountedPrice: discountedPrice
                            ? discountedPrice / 100
                            : 0,
                        inStock,
                        isPublished
                    });
                    setExistingImageUrls(serverImages || []);
                    setPreviewUrls(serverImages || []);
                    setProductId(existingProduct.product.id);
                }
            } catch (error) {
                console.error("Error fetching address:", error);
                toast.error("Failed to fetch address for editing.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (isLoading)
        return (
            <div className="text-center py-10 text-sm">
                <SkeletonCard />
            </div>
        );

    return (
        <>
            <div className="container max-w-3xl">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormItem>
                            <FormLabel>Product Images</FormLabel>
                            <div className="flex gap-3 mt-2 flex-wrap">
                                {[...Array(4)].map((_, index) => (
                                    <label
                                        key={index}
                                        htmlFor={`image-${index}`}
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id={`image-${index}`}
                                            hidden
                                            multiple
                                            onChange={(e) =>
                                                handleImageChange(
                                                    e.target.files
                                                )
                                            }
                                        />
                                        <Image
                                            src={
                                                previewUrls[index] ||
                                                imagePlaceholder
                                            }
                                            alt="Preview"
                                            width={100}
                                            height={100}
                                            className="rounded border cursor-pointer"
                                        />
                                    </label>
                                ))}
                            </div>
                        </FormItem>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Product name"
                                            className="placeholder:text-sm"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea rows={4} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <CategorySelect field={field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="basePrice"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Base Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.valueAsNumber;
                                                    if (value < 0) return;
                                                    field.onChange(
                                                        Number.isNaN(value)
                                                            ? undefined
                                                            : value
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="discountedPrice"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Discounted Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.valueAsNumber;
                                                    if (value < 0) return;

                                                    field.onChange(
                                                        Number.isNaN(value)
                                                            ? undefined
                                                            : value
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex gap-4 items-center">
                            <div>
                                <FormField
                                    control={form.control}
                                    name="inStock"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>
                                                Products in stock
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target
                                                                .valueAsNumber;
                                                        if (value < 0) return;

                                                        field.onChange(
                                                            Number.isNaN(value)
                                                                ? undefined
                                                                : value
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="isPublished"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                            <FormLabel className="text-sm font-normal">
                                                Publish Product
                                            </FormLabel>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" className="cursor-pointer">
                                {isPending
                                    ? productId
                                        ? "Updating..."
                                        : "Adding..."
                                    : productId
                                    ? "Update Product"
                                    : "Add Product"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    );
};

export default AddProduct;
