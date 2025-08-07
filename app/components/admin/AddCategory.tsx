import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React, { Dispatch, SetStateAction } from "react";

const AddCategory = ({
    open,
    setOpen,
    newCategory,
    setNewCategory,
    handleAddCategory,
    isPending
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    newCategory: string;
    setNewCategory: Dispatch<SetStateAction<string>>;
    handleAddCategory: () => void;
    isPending: boolean;
}) => {
    return (
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
    );
};

export default AddCategory;
