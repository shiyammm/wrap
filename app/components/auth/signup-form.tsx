"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { checkExistingUser } from "@/lib/actions/common.action";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { signUpForm } from "@/lib/validation";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const res = signUpForm.safeParse({
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirm-password")
        });

        if (!res.success) {
            setError(
                JSON.parse(res.error.message)[0].message || "Validation error"
            );
            return;
        }

        const { name, email, password } = res.data;

        const isExistingUser = await checkExistingUser(email);

        if (!isExistingUser.success) {
            toast.error(isExistingUser.message);
            setError(isExistingUser.message);
            return;
        }

        const newUser = await signUp.email({
            name,
            email,
            password
        });

        if (newUser.error) {
            toast.error(newUser.error.message);
            return;
        }

        if (newUser.data) {
            toast.success("Account created successfully!");
            setTimeout(() => {
                router.push("/");
            }, 1000);
            return;
        }
    };

    const handleGoogleSignUp = async () => {
        await signIn.social({
            provider: "google",
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Signed in with Google!");
                },
                onError: (error) => {
                    toast.error(
                        error.error.message || "Failed to sign in with Google"
                    );
                }
            },
            callbackURL: "/"
        });
    };

    const handleAccountSwitch = (value: "user" | "seller") => {
        if (value === "user") router.push("/signup");
        else router.push("/seller-auth/signup");
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Join Giftably
                </h2>
                <p className="text-muted-foreground text-sm">
                    Discover unique gifts, manage your orders, and enjoy a
                    personalized experience.
                </p>
                <Select
                    onValueChange={(val: "user" | "seller") =>
                        handleAccountSwitch(val)
                    }
                >
                    <SelectTrigger className="w-fit mx-auto text-xs border-none shadow-none bg-transparent p-0 focus:ring-0 focus:ring-offset-0">
                        <SelectValue
                            placeholder={
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    User Account
                                </span>
                            }
                        />
                    </SelectTrigger>
                    <SelectContent className="border-none">
                        <SelectItem value="seller">
                            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                                Seller Account
                            </span>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                        Fill in the details below to get started with Giftably.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Jane Doe"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="jane@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="confirm-password">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    required
                                />
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm font-medium">
                                    {error}
                                </div>
                            )}
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full">
                                    Create Account
                                </Button>
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="w-full cursor-pointer"
                                    onClick={handleGoogleSignUp}
                                >
                                    Sign up with Google
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="underline underline-offset-4"
                            >
                                Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
