"use client";
// Text Area
import TextareaAutosize from "react-textarea-autosize";
// Editor
import type EditorJS from "@editorjs/editorjs";
// React Hook Form
import { useForm } from "react-hook-form";
// Zod
import { postCreationRequest, postValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
// React
import { useCallback, useEffect, useRef, useState } from "react";
// Upload Thing
import { useUploadThing } from "@/lib/uploadthings";
// ShadCn
import { toast } from "@/hooks/use-toast";
// Hook
import useCreatePost from "@/hooks/useCreatePost";
// Next
import { usePathname, useRouter } from "next/navigation";

interface IPageProps {
    subredditId: string;
}

export default function Editor({ subredditId }: IPageProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<postCreationRequest>({
        resolver: zodResolver(postValidator),
        defaultValues: {
            subredditId,
            title: "",
            content: null,
        },
    });

    const router = useRouter();
    const pathname = usePathname();

    const ref = useRef<EditorJS>();

    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        if (typeof Window !== "undefined") {
            setIsMounted(true);
        }
    }, []);

    useEffect(() => {
        if (Object.keys(errors).length) {
            for (const value of Object.values(errors)) {
                toast({
                    title: "Something went wrong",
                    description: (value as { message: string }).message,
                    variant: "destructive",
                });
            }
        }
    }, [errors]);

    const { startUpload } = useUploadThing("imageUploader");

    const initializeEditor = useCallback(async () => {
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const Embed = (await import("@editorjs/embed")).default;
        const Table = (await import("@editorjs/table")).default;
        const List = (await import("@editorjs/list")).default;
        const Code = (await import("@editorjs/code")).default;
        const LinkTool = (await import("@editorjs/link")).default;
        const InlineCode = (await import("@editorjs/inline-code")).default;
        const ImageTool = (await import("@editorjs/image")).default;
        if (!ref.current) {
            const editor = new EditorJS({
                holder: "editor",
                onReady() {
                    ref.current = editor;
                },
                placeholder: "Type here to write your post...",
                data: { blocks: [] },
                tools: {
                    header: Header,
                    linkTool: {
                        class: LinkTool,
                        config: {
                            endpoint: "/api/link",
                        },
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file: File) {
                                    const res = await startUpload([file]);

                                    if (res) {
                                        return {
                                            success: 1,
                                            file: {
                                                url: res[0].url,
                                            },
                                        };
                                    }
                                },
                            },
                        },
                    },
                    list: List,
                    code: Code,
                    inlineCode: InlineCode,
                    table: Table,
                    embed: Embed,
                },
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const init = async () => {
            await initializeEditor();

        };

        if (isMounted) {
            init();
            return () => {
                ref.current?.destroy();
                ref.current = undefined;
            };
        }
    }, [isMounted, initializeEditor]);

    const { mutateAsync } = useCreatePost();

    const createPostHandler = async (data: postCreationRequest) => {
        const block = await ref.current?.save();

        const payload: postCreationRequest = {
            subredditId,
            title: data.title,
            content: block,
        };

        mutateAsync(payload)
            .then(() => {

                const newPahtname = pathname.split("/").slice(0, -1).join("/");

                router.replace(newPahtname);

                router.refresh();

                return toast({
                    description: "Your post has been published.",
                });

            })
            .catch(() => {

                return toast({
                    title: "There was a problem",
                    description:
                        "Your post was not published, Please try again later.",
                    variant: "destructive",
                });

            });
    };

    return (
        <div className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <form
                className="w-fit"
                id="subreddit-post-form"
                onSubmit={handleSubmit(createPostHandler)}
            >
                <div className="prose prose-stone dark:prose-invert">
                    <TextareaAutosize
                        {...register("title")}
                        className="w-full resize-none appearance-none overflow-hidden bg-transparent text-4xl font-bold focus:outline-none"
                        placeholder="Title"
                    />
                    <div className="min-h-[500px]" id="editor" />
                </div>
            </form>
        </div>
    );
}
