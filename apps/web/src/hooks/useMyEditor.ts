import { useMemo, useState } from "react";
import { useDocumentProvider } from "@/components/document-provider";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { useEditor } from "@tiptap/react";

const cursorColors = [
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
    "#f783ac",
];
const userNames = [
    "John",
    "Jane",
    "Bob",
    "Alice",
    "Charlie",
    "Dave",
    "Eve",
    "Frank",
    "Grace",
    "Heidi",
    "Ivan",
    "Judy",
    "Karen",
    "Liam",
    "Mike",
    "Olivia",
    "Peter",
    "Quinn",
    "Sarah",
    "Tom",
    "Ursula",
    "Victor",
    "Wendy",
    "Xavier",
    "Yvonne",
    "Zack",
    "Zoe",
];
const pickUser = () => userNames[Math.floor(Math.random() * userNames.length)];
const pickColor = () =>
    cursorColors[Math.floor(Math.random() * cursorColors.length)];

const useMyEditor = (id: string, editorClassName = "border p-2 rounded") => {
    const { doc, provider } = useDocumentProvider();
    const [userName] = useState(pickUser());
    const [color] = useState(pickColor());

    // Memoize the extensions array
    const extensions = useMemo(
        () => [
            StarterKit.configure({
                codeBlock: false,
                history: false,
            }),

            Collaboration.configure({
                document: doc,
                field: id,
            }),
            CollaborationCursor.configure({
                provider: provider,
                user: {
                    name: userName,
                    color: color,
                },
            }),
            Placeholder.configure({
                placeholder: "Type something...",
            }),
        ],
        [doc, id, provider, userName, color],
    );

    // Memoize editor props
    const editorProps = useMemo(
        () => ({
            attributes: {
                class: editorClassName,
            },
        }),
        [editorClassName],
    );

    const editor = useEditor({
        immediatelyRender: false, // Due to SSR
        extensions,
        editorProps,
    });

    return editor;
};

export default useMyEditor;
