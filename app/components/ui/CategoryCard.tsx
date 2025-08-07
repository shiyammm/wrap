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
                        src={imageUrl}
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
