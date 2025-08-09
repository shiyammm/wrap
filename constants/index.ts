import Logo from "@/public/Logo.svg";

export default Logo;

export const currency = process.env.NEXT_PUBLIC_CURRENCY;

interface ShippingMethod {
    id: string;
    name: string;
    price: number;
    estimatedDays: string;
    description: string;
}

export const WrappingOptions = [
    {
        id: "none",
        name: "No Wrapping",
        price: 0,
        image: "https://ik.imagekit.io/nybhaaubj/mediamodifier-isA8_lAgDjE-unsplash.jpg"
    },
    {
        id: "basic",
        name: "Basic Wrap",
        price: 20,
        image: "https://ik.imagekit.io/nybhaaubj/annie-spratt-rx1iJ59jRyU-unsplash%20(1).jpg"
    },
    {
        id: "premium",
        name: "Premium Wrap with Ribbon",
        price: 50,
        image: "https://ik.imagekit.io/nybhaaubj/ekaterina-shevchenko-ZLTlHeKbh04-unsplash.jpg"
    }
];

export const predefinedMessages = [
    "Happy Birthday! 🎂",
    "Congratulations on your special day! 🎉",
    "Sending you love and warm wishes 💝"
];

export const paymentMethods = ["COD", "CARD"];

export const shippingMethods: ShippingMethod[] = [
    {
        id: "standard",
        name: "Standard Shipping",
        price: 50,
        estimatedDays: "3-5 days",
        description: `Free shipping on orders over ${currency}500`
    },
    {
        id: "express",
        name: "Express Shipping",
        price: 100,
        estimatedDays: "1-2 days",
        description: "Priority delivery with tracking"
    }
];
