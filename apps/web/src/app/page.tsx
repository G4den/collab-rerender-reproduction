"use client";

import { useDocumentProvider } from "@/components/document-provider";
import Tiptap from "@/components/tiptap";

export default function Home() {
  const { doc } = useDocumentProvider();

  if (!doc) return <div>Loading...</div>;

  return (
    <main className="mx-auto flex max-w-screen-lg flex-col items-center gap-12 bg-background px-4 py-20 lg:py-28">
      <h1 className="text-center text-4xl font-bold">
        Collaboration Rerender Demo
      </h1>

      <Tiptap id="a" />
      <Tiptap id="b" />
      <Tiptap id="c" />
    </main>
  );
}
