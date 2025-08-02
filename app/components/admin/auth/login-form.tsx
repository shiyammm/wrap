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
import { loginForm } from "@/lib/validation";
import { useState, useTransition } from "react";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { isSeller } from "@/lib/actions/seller.action";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            startTransition(async () => {
                const formData = new FormData(
                    e.currentTarget as HTMLFormElement
                );

                const res = loginForm.safeParse({
                    email: formData.get("email") as string,
                    password: formData.get("password") as string
                });

                if (!res.success) {
                    setError(
                        JSON.parse(res.error.message)[0].message ||
                            "Validation error"
                    );
                    return;
                }
                const { email, password } = res.data;

                const data = await signIn.email({
                    email,
                    password
                });

                if (data.error) {
                    toast.warning("Login failed");
                    setError(data.error.message || "Login failed");
                    return;
                }

                const validatedUser = await isSeller(data.data.user.id);

                if (validatedUser) {
                    toast.success("Login successful");
                    setError("");
                }

                setTimeout(() => {
                    router.push("/");
                }, 1000);
            });
        } catch (error) {
            setError("An unexpected error occurred");
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Seller Login
                </h2>
                <p className="text-muted-foreground text-sm">
                    Log in to manage products, view orders, and grow your store
                    on Giftably.
                </p>
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Seller Account
                </span>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                />
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm">
                                    {error}
                                </div>
                            )}
                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full cursor-pointer"
                                >
                                    {isPending ? "Logging in..." : "Login"}
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/seller/auth/signup"
                                className="underline underline-offset-4"
                            >
                                Sign up
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
