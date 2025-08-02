import { useEffect, useState, useTransition } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createCategory, getCategories } from "@/lib/actions/seller.action";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Category } from "@/prisma/generated";
import { ControllerRenderProps } from "react-hook-form";
import { productSchema } from "@/lib/validation";
import z from "zod";

type ProductFormValues = z.infer<typeof productSchema>;

type Props = {
    field: ControllerRenderProps<ProductFormValues, "category">;
};

export const CategorySelect = ({ field }: Props) => {
    const [open, setOpen] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [isPending, startTransition] = useTransition();

    const handleAddCategory = async () => {
        startTransition(async () => {
            try {
                const res = await createCategory(newCategory);

                if (res.success) {
                    toast.success(res.message);
                    setOpen(false);
                    setNewCategory("");
                    await fetchCategories();
                } else {
                    toast.error(res.error);
                }
            } catch (error) {
                toast.error(`Something went wrong ${error}`);
            }
        });
    };

    const fetchCategories = async () => {
        const res = await getCategories();
        if (res) {
            setCategories(res);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                    {categories.map((cat) => (
                        <SelectItem
                            key={cat.id}
                            value={cat.name}
                            className="capitalize"
                        >
                            {cat.name}
                        </SelectItem>
                    ))}
                    <div className="py-1 px-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full text-left text-sm"
                            onClick={() => setOpen(true)}
                        >
                            <Plus /> Add New Category
                        </Button>
                    </div>
                </SelectContent>
            </Select>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <Input
                            placeholder="Enter category name"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <Button onClick={handleAddCategory}>
                            {isPending ? "Creating..." : "Create"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
