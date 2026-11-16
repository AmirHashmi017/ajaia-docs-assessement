"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

function ToolbarButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`shrink-0 rounded-lg px-2.5 py-1.5 text-sm ${
        active ? "bg-[var(--accent)] text-white" : "bg-white text-[var(--ink)]"
      } border border-[var(--line)] disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  content,
  editable,
  onChange,
}: {
  content: string;
  editable: boolean;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editor, editable]);

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== content) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="min-h-[280px] p-4 text-sm text-[var(--ink-soft)] sm:min-h-[420px] sm:p-6">
        Loading editor...
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-[var(--line)] bg-[var(--surface-muted)] px-2 py-2 sm:px-3">
        <div className="toolbar-scroll">
          <ToolbarButton
            disabled={!editable}
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            Bold
          </ToolbarButton>
          <ToolbarButton
            disabled={!editable}
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            Italic
          </ToolbarButton>
          <ToolbarButton
            disabled={!editable}
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            Underline
          </ToolbarButton>
          <ToolbarButton
            disabled={!editable}
            active={editor.isActive("heading", { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            disabled={!editable}
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            disabled={!editable}
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            Bullets
          </ToolbarButton>
          <ToolbarButton
            disabled={!editable}
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            Numbers
          </ToolbarButton>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
