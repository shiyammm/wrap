import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";

const footerLinks = [
    {
        title: "Shop All Gifts",
        href: "/shop"
    },
    {
        title: "Occasions",
        href: "#"
    },
    {
        title: "Corporate Gifting",
        href: "#"
    },
    {
        title: "FAQs",
        href: "#"
    },
    {
        title: "Contact Us",
        href: "#"
    },
    {
        title: "Privacy Policy",
        href: "#"
    }
];

const Footer = () => {
    return (
        <footer>
            <div className="max-w-screen-xl mx-auto">
                <div className="py-12 flex flex-col justify-start items-center">
                    {/* Logo */}
                    <div className="text-2xl font-bold text-foreground">
                        🎁 Giftably
                    </div>

                    <ul className="mt-6 flex items-center gap-4 flex-wrap justify-center">
                        {footerLinks.map(({ title, href }) => (
                            <li key={title}>
                                <Link
                                    href={href}
                                    className="text-muted-foreground hover:text-foreground font-medium text-sm"
                                >
                                    {title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <Separator />
                <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
                    {/* Copyright */}
                    <span className="text-muted-foreground text-sm">
                        &copy; {new Date().getFullYear()}{" "}
                        <Link
                            href="/"
                            target="_blank"
                            className="hover:underline"
                        >
                            Giftly
                        </Link>
                        . Spread joy, one gift at a time.
                    </span>

                    <div className="flex items-center gap-5 text-muted-foreground">
                        <Link href="#" target="_blank" aria-label="Twitter">
                            <FaXTwitter className="h-5 w-5" />
                        </Link>
                        <Link href="#" target="_blank" aria-label="Instagram">
                            <FaInstagram className="h-5 w-5" />
                        </Link>
                        <Link href="#" target="_blank" aria-label="YouTube">
                            <FaYoutube className="h-5 w-5" />
                        </Link>
                        <Link href="#" target="_blank" aria-label="Facebook">
                            <FaFacebook className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
