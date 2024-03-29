"use client";  

/* eslint-disable @typescript-eslint/no-explicit-any */
// Next
import dynamic from "next/dynamic";
import Image from "next/image";

const Output = dynamic(
    async () => (await import("editorjs-react-renderer")).default,
    {
        ssr: false,
    }
);

interface IEditorOutputProps {
    content: any;
}

const style = {
    paragraph: {
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
    },
};

const renderers = {
    image: CustomImageRenderer,
    code: CustomCodeRenderer,
};

export default function EditorOutput({ content }: IEditorOutputProps) {
    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        <Output
            className="text-sm"
            data={content}
            renderers={renderers}
            style={style}
        />
    );
}

function CustomImageRenderer({ data }: any) {
    const src = data.file.url;

    return (
        <div className="relative min-h-[15rem] w-full">
            <Image alt="image" className="object-contain" fill src={src} />
        </div>
    );
}

function CustomCodeRenderer({ data }: any) {
    return (
        <pre className="rounded-md bg-gray-800 p-4">
            <code className="text-sm text-gray-100">{data.code}</code>
        </pre>
    );
}
