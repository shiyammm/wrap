"use client";

import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React, { useState } from "react";

const ProductThumbnail = ({
    images,
    isOnSale
}: {
    images: string[];
    isOnSale: boolean;
}) => {
    const [thumbnail, setThumbnail] = useState<string | StaticImport>(
        images[0]
    );

    return (
        <div className="flex gap-3 relative h-full">
            <div className="flex flex-col gap-3">
                {images.length > 2 ? (
                    images.map((image, index) => (
                        <div
                            key={index}
                            onClick={() => setThumbnail(image)}
                            className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer relative"
                        >
                            <Image
                                width={200}
                                height={200}
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                            />
                        </div>
                    ))
                ) : (
                    <div className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer">
                        <Image
                            width={200}
                            height={200}
                            src={thumbnail}
                            alt={`Thumbnail 1`}
                        />
                    </div>
                )}
            </div>

            <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden relative my-auto">
                {isOnSale && (
                    <span className="absolute top-4 left-4 z-10 rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-3 py-1.5 text-xs font-bold text-white">
                        Sale
                    </span>
                )}

                <Image
                    width={500}
                    height={500}
                    src={images.length > 2 ? thumbnail : images[0]}
                    alt="Selected product"
                />
            </div>
        </div>
    );
};

export default ProductThumbnail;
