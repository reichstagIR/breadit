"use client";

// ShadCn
import { Button } from "./ui/Button";
// Icons
import { X } from "lucide-react";
// Next
import { useRouter } from "next/navigation";

export default function CloseModal() {
    const router = useRouter();

    const closeHandler = () => {
        router.back();
    };

    return (
        <Button
            aria-label="close modal"
            className="h-6 w-6 cursor-pointer rounded-md p-0"
            onClick={closeHandler}
            variant="subtle"
        >
            <X className="h-4 w-4" />
        </Button>
    );
}
