"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NavAuthActions = () => {
    const { data } = useSession();
    const user = data?.user;
    const router = useRouter();

    if (!user?.id) {
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
                    <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                    <AvatarFallback>
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={async () => {
                        await signOut();
                        router.push("/");
                    }}
                >
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NavAuthActions;
