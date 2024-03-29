// Component
import CloseModal from "@/components/CloseModal";
import SignUp from "@/components/SignUp";

export default function Page() {
    return (
        <div className="fixed inset-0 z-10 bg-zinc-900/20">
            <div className="mx-auth container flex h-full max-w-lg items-center">
                <div className="relative h-fit w-full rounded-lg bg-white py-20">
                    <div className="absolute right-4 top-4">
                        <CloseModal />
                    </div>
                    <SignUp />
                </div>
            </div>
        </div>
    );
}
