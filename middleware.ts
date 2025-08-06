import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
    "/",
    "/shop",
    "/categories",
    "/signup",
    "/login",
    "/seller-auth/login",
    "/seller-auth/signup"
];

const userRoutes = [
    "/",
    "/shop",
    "/categories",
    "/cart",
    "/profile",
    "/orders",
    "/cancel",
    "/add-address",
    "/login",
    "/signup"
];

const protectedRoutes = ["/cart", "/add-address", "/checkout", "/profile"];

export const middleware = async (req: NextRequest) => {
    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname.startsWith("/api") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const sessionToken =
        req.cookies.get("__Secure-better-auth.session_token")?.value ||
        req.cookies.get("better-auth.session_token")?.value;

    if (!sessionToken) {
        if (
            publicRoutes.some(
                (route) =>
                    pathname === route || pathname.startsWith(route + "/")
            )
        ) {
            return NextResponse.next();
        }

        if (pathname === "/seller" || pathname.startsWith("/seller")) {
            return NextResponse.redirect(
                new URL("/seller-auth/login", req.url)
            );
        }

        if (protectedRoutes.some((route) => pathname.startsWith(route))) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (
        pathname === "/" ||
        (userRoutes.some((route) => pathname.startsWith(route)) &&
            !pathname.startsWith("/seller"))
    ) {
        try {
            const roleResponse = await fetch(
                new URL("/api/get-role", req.url),
                {
                    headers: {
                        cookie: `${
                            req.cookies.get(
                                "__Secure-better-auth.session_token"
                            )
                                ? "__Secure-"
                                : ""
                        }better-auth.session_token=${sessionToken}`
                    },
                    cache: "no-store"
                }
            );

            const roleData = await roleResponse.json();

            if (!roleResponse.ok || !roleData.role) {
                return NextResponse.redirect(new URL("/login", req.url));
            }

            if (roleData.role === "SELLER") {
                return NextResponse.redirect(
                    new URL("/seller/products", req.url)
                );
            }
        } catch (err) {
            console.error("Role check failed:", err);
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
};

export const config = {
    matcher: ["/((?!_next|static|api|.*\\..*).*)"]
};
