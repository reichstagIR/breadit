"use client";

// ShadCn
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/Command";
// React Query
import { useQuery } from "@tanstack/react-query";
// Axios
import axios from "axios";
// Prisma
import { Prisma, Subreddits } from "@prisma/client";
// React
import { useCallback, useState, useRef, useEffect } from "react";
// Next
import { useRouter, usePathname } from "next/navigation";
// Icons
import { Users } from "lucide-react";
// lodash
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

export default function SearchBar() {
    const [input, setInput] = useState<string>("");

    const pathname = usePathname();

    const { data, isFetched, refetch } = useQuery({
        queryFn: async () => {
            const { data } = await axios.get(`/api/search?q=${input}`);
            return data as (Subreddits & {
                _count: Prisma.SubredditsCountOutputType;
            })[];
        },
        queryKey: ["search"],
        enabled: false,
    });

    const request = debounce(async () => {
        refetch();
    }, 3000);

    const debounceRequest = useCallback(() => {
        request();
    }, [request]);

    const commandRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(commandRef, () => {
        setInput("");
    });

    const router = useRouter();

    useEffect(() => {
        setInput("");
    }, [pathname]);

    return (
        <Command
            className="relative z-50 max-w-lg overflow-visible rounded-lg border"
            ref={commandRef}
        >
            <CommandInput
                className="border-none outline-none ring-0 focus:border-none focus:outline-none"
                onValueChange={(text) => {
                    setInput(text);
                    debounceRequest();
                }}
                placeholder="Search communities..."
                value={input}
            />
            <CommandList className="absolute inset-x-0 top-full rounded-b-md bg-white shadow">
                {input.length > 0 ? (
                    <>
                        {isFetched && (
                            <CommandEmpty>No result found.</CommandEmpty>
                        )}
                        {(data?.length ?? 0) > 0 ? (
                            <CommandGroup heading="Communities">
                                {data?.map((subreddit) => (
                                    <a
                                        href={`/r/${subreddit.name}`}
                                        key={subreddit.id}
                                    >
                                        <CommandItem
                                            className="pointer-events-auto"
                                            onSelect={(e) => {
                                                router.push(`/r/${e}`);
                                                router.refresh();
                                            }}
                                            value={subreddit.name}
                                        >
                                            <Users className="mr-2 h-4 w-4" />
                                            r/{subreddit.name}
                                        </CommandItem>
                                    </a>
                                ))}
                            </CommandGroup>
                        ) : null}
                    </>
                ) : null}
            </CommandList>
        </Command>
    );
}
