import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ContainerTextFlipDemo } from "./Buttons/ContainerFlipDemo";

export default function Hero() {
    return (
        <>
            <div className="w-full h-[95vh] flex items-center justify-center ">
                <div className="container mx-auto px-4 py-24 md:px-6 lg:py-32 2xl:max-w-[1400px]">
                    <div className="flex justify-center">
                        <Link
                            className="inline-flex items-center gap-x-2 rounded-full border p-1 ps-3 text-sm transition text-center"
                            href="/shop"
                        >
                            🎁 New Collection – Shop Festive Gifts
                            <span className="bg-muted-foreground/15 inline-flex items-center justify-center gap-x-2 rounded-full px-2.5 py-1.5 text-sm font-semibold">
                                <svg
                                    className="h-4 w-4 flex-shrink-0"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </span>
                        </Link>
                    </div>
                    <div className="mx-auto mt-5 max-w-2xl text-center">
                        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                            Send <ContainerTextFlipDemo /> Gifts.
                        </h1>
                    </div>
                    <div className="mx-auto mt-5 max-w-3xl text-center">
                        <p className="text-muted-foreground text-lg">
                            Discover the perfect gift for every occasion.
                            Thoughtfully curated gift boxes, ready to delight
                            your loved ones.
                        </p>
                    </div>
                    <div className="mt-8 flex justify-center gap-3">
                        <Link href="/shop" className="cursor-pointer">
                            <Button size={"lg"}>Shop Now</Button>
                        </Link>
                        <Link href="/categories" className="cursor-pointer">
                            <Button size={"lg"} variant={"outline"}>
                                Explore Collections
                            </Button>
                        </Link>
                    </div>
                    <div className="mt-5 flex items-center justify-center gap-x-1 sm:gap-x-3">
                        <span className="text-muted-foreground text-sm">
                            Fast, Nationwide Delivery
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
