import { Suspense } from "react";
import NotFoundClient from "./not-found-client";

export default function NotFoundPage() {
    return (
        <div className="py-16 text-center">
            <h1 className="text-3xl font-bold mb-2">404 - Page Not Found</h1>
            <p className="text-muted-foreground">
                The page you are looking for doesn’t exist.
            </p>
            <Suspense fallback={null}>
                <NotFoundClient />
            </Suspense>
        </div>
    );
}
