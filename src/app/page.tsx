// Styles
import { buttonVariants } from "@/components/ui/Button";
// Icons
import { HomeIcon } from "lucide-react";
// Next
import Link from "next/link";
// Next Auth
import { getSession } from "@/lib/auth";
// Component
import CustomFeed from "@/components/CustomFeed";
import GeneralFeed from "@/components/GeneralFeed";

export default async function Home() {
    const session = await getSession();

    return (
        <>
            <h1 className="text-3xl font-bold md:text-4xl">Your feed</h1>
            <div className="gap-y grid grid-cols-1 py-6 md:grid-cols-3 md:gap-x-4">
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-expect-error */}
                {session ? <CustomFeed /> : <GeneralFeed />}
                <div className="order-first h-fit overflow-hidden rounded-lg border border-gray-200 md:order-last">
                    <div className="bg-emerald-100 px-6 py-4">
                        <p className="flex items-center gap-1.5 py-3 font-semibold">
                            <HomeIcon className="h-4 w-4" />
                            Home
                        </p>
                    </div>
                    <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                        <div className="flex justify-between gap-x-4 py-3">
                            <p className="text-zinc-500">
                                Your personal Breadit Homepage. Come here to
                                check in with your favorite communities
                            </p>
                        </div>
                        <Link
                            className={buttonVariants({
                                className: "mb-6 mt-5 w-full ",
                            })}
                            href="/r/create"
                        >
                            Create Community
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
