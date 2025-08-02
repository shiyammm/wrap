// components/ui/CategoryCard.tsx

import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
    categoryId: string;
    name: string;
    imageUrl: string;
}

const CategoryCard = ({ categoryId, name, imageUrl }: CategoryCardProps) => {
    return (
        <Link href={`/categories/${categoryId}`}>
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
                <div className="relative h-48 w-full overflow-hidden">
                    <Image
                        src={
                            "https://images.unsplash.com/photo-1682688759350-050208b1211c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        }
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
                        {name}
                    </h3>
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;
