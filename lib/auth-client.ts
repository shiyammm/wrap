import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, useSession, signOut } = createAuthClient();

export const authClient = createAuthClient({
    baseURL: process.env.BASE_URL,
    plugins: [nextCookies()]
});
