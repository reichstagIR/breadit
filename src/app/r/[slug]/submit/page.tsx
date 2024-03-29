// Lib
import { db } from "@/lib/db";
// Next
import { notFound } from "next/navigation";
// ShadCn
import { Button } from "@/components/ui/Button";
// Editor
import Editor from "@/components/Editor";

interface IPageProps {
    params: {
        slug: string;
    };
}

export default async function Page({ params }: IPageProps) {
    const subreddit = await db.subreddits.findFirst({
        where: {
            name: params.slug,
        },
    });

    if (!subreddit) return notFound();

    return (
        <div className="flex flex-col items-start gap-6">
            <div className="border-b border-gray-200 pb-5">
                <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
                    <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
                        Create post
                    </h3>
                    <p className="ml-2 mt-1 truncate text-sm text-gray-500">
                        in r/{params.slug}
                    </p>
                </div>
            </div>

            <Editor subredditId={subreddit.id} />

            <div className="flex w-full justify-end">
                <Button
                    className="w-full"
                    form="subreddit-post-form"
                    type="submit"
                >
                    Post
                </Button>
            </div>
        </div>
    );
}
