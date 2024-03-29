// Next Auth
import { authOption, getSession } from "@/lib/auth";
// Next
import { redirect } from "next/navigation";
// Component
import UserNameForm from "@/components/UserNameForm";

export const metadata = {
    title: "settings",
    description: "Manage account and website settings.",
};

export default async function Page() {
    const session = await getSession();

    if (!session) redirect(authOption.pages?.signIn || "/sing-in");

    return (
        <div className="mx-auto max-w-4xl py-12">
            <div className="grid items-center gap-8">
                <h1 className="text-3xl font-bold md:text-4xl">settings</h1>
            </div>
            <div className="grid gap-10">
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-expect-error */}
                <UserNameForm
                    user={{
                        id: session.user.id,
                        username: session.user.username ?? "",
                    }}
                />
            </div>
        </div>
    );
}
