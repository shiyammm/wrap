import { SignupForm } from "@/app/components/admin/auth/signup-form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const SignUp = async () => {
    const session = await getSession();

    if (session?.user.id) {
        redirect("/");
    }

    return (
        <div className="flex h-[90vh] w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <SignupForm />
            </div>
        </div>
    );
};

export default SignUp;
