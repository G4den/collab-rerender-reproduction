/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useEffect } from "react";
import { EditorContent, type Editor } from "@tiptap/react";

import {
    FaBold,
    FaItalic,
    FaParagraph,
    FaHeading,
    FaCode,
} from "react-icons/fa";

import { FaSquareRootAlt } from "react-icons/fa";
import useMyEditor from "@/hooks/useMyEditor";

interface MenuButtonProps {
    onClick: () => void;
    disabled?: boolean;
    isActive?: boolean;
    children: React.ReactNode;
}

const MenuButton: React.FC<MenuButtonProps> = ({
    onClick,
    disabled,
    isActive,
    children,
}) => {
    return (
        <button
            tabIndex={-1}
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
            onMouseDown={(e) => {
                e.preventDefault();
            }}
            disabled={disabled}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${isActive
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                } ${disabled ? "cursor-not-allowed opacity-50" : ""} border border-input shadow-sm`}
        >
            {children}
        </button>
    );
};

const MenuBar = ({ editor, id }: { editor: Editor; id: string }) => (
    <div
        className="flex flex-wrap justify-end gap-0.5"
        onMouseDown={(e) => e.preventDefault()} // Prevent focus loss when clicking between buttons
    >
        <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
        >
            <FaBold />
        </MenuButton>
        <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
        >
            <FaItalic />
        </MenuButton>
        <MenuButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive("paragraph")}
        >
            <FaParagraph />
        </MenuButton>
        <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
        >
            <FaHeading />
        </MenuButton>
        <MenuButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
        >
            <FaCode />
        </MenuButton>
        <MenuButton
            onClick={() => {
                const { from, to } = editor.state.selection;
                const text = editor.state.doc.textBetween(from, to);
                editor.chain().focus().insertContent(`$${text}$`).run();
            }}
            isActive={editor.isActive("math")}
        >
            <FaSquareRootAlt />
        </MenuButton>
    </div>
);
const Tiptap = ({ id: id }: { id: string }) => {
    const renderCount = React.useRef(0);
    const [, forceUpdate] = React.useState({});

    // Log render count on each render without causing a loop
    useEffect(() => {
        renderCount.current += 1;
        // Force a single update after initial mount to show the first count
        if (renderCount.current === 1) {
            forceUpdate({});
        }
        console.log(`Tiptap ${id} rendered:`, renderCount.current);
    });

    const [isEditorFocused, setIsEditorFocused] = React.useState(false);

    const editor = useMyEditor(
        id,
        "md:max-h-96 max-h-56 overflow-y-auto border p-2 rounded",
    );

    React.useEffect(() => {
        if (editor) {
            editor.on("focus", () => setIsEditorFocused(true));
            editor.on("blur", () => setIsEditorFocused(false));

            return () => {
                editor.off("focus");
                editor.off("blur");
            };
        }
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex w-full shrink-0 grow-0 flex-col justify-end gap-4 md:w-[calc(50%-1rem)]">
            <div className="flex h-10 w-full items-end gap-2 md:gap-4">
                {isEditorFocused ? (
                    <MenuBar editor={editor} id={id} />
                ) : (
                    <p>{`Field ${id}`}</p>
                )}
            </div>
            <div className="text-sm text-muted-foreground">
                Render count: {renderCount.current}
            </div>
            <EditorContent editor={editor} />
        </div>
    );
};
export default Tiptap;
