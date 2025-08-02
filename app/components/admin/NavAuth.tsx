"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

const NavAuthActions = () => {
    const [showAuthButtons, setShowAuthButtons] = useState(true);
    const { data } = useSession();
    const user = data?.user;

    useEffect(() => {
        if (data?.user.id) {
            setShowAuthButtons(!showAuthButtons);
        }
    }, [data?.user.id, showAuthButtons]);

    const router = useRouter();

    if (showAuthButtons) {
        return (
            <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                    <Link href="/signup">Sign Up</Link>
                </Button>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage
                        src={user?.image || ""}
                        alt={user?.name || "User"}
                    />
                    <AvatarFallback>
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NavAuthActions;
