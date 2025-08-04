"use client";

import { useEffect } from "react";
import { toast } from "sonner";

const SuccessClient = ({
    message,
    success
}: {
    message: string;
    success: boolean;
}) => {
    useEffect(() => {
        if (message) {
            if (success) toast.success(message);
            else toast.error(message);
        }
    }, [message, success]);

    return null;
};

export default SuccessClient;
