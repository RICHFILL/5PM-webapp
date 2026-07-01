import { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Heading1, Heading2, Heading3,
  Link as LinkIcon, Undo, Redo,
} from "lucide-react";

function ToolbarButton({ active, onClick, children, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-md transition-colors ${
        active ? "bg-dark-lavender text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-gray-200" />;
}

export default function RichTextEditor({ value, onChange, label, error }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl || "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className={`rounded-xl border overflow-hidden focus-within:ring-2 focus-within:ring-neon-tangerine focus-within:border-neon-tangerine ${
        error ? "border-red-500" : "border-gray-300"
      }`}>
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
          <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
            <Bold size={15} />
          </ToolbarButton>
          <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
            <Italic size={15} />
          </ToolbarButton>
          <ToolbarButton active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
            <UnderlineIcon size={15} />
          </ToolbarButton>
          <ToolbarButton active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
            <Strikethrough size={15} />
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1">
            <Heading1 size={15} />
          </ToolbarButton>
          <ToolbarButton active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
            <Heading2 size={15} />
          </ToolbarButton>
          <ToolbarButton active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
            <Heading3 size={15} />
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
            <List size={15} />
          </ToolbarButton>
          <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered List">
            <ListOrdered size={15} />
          </ToolbarButton>
          <ToolbarButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote">
            <Quote size={15} />
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton active={editor.isActive("link")} onClick={setLink} title="Link">
            <LinkIcon size={15} />
          </ToolbarButton>
          <div className="flex-1" />
          <ToolbarButton active={false} onClick={() => editor.chain().focus().undo().run()} title="Undo">
            <Undo size={15} />
          </ToolbarButton>
          <ToolbarButton active={false} onClick={() => editor.chain().focus().redo().run()} title="Redo">
            <Redo size={15} />
          </ToolbarButton>
        </div>
        <EditorContent editor={editor} className="prose prose-sm max-w-none p-3 min-h-[120px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[100px]" />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
