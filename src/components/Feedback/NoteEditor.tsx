"use client";

import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Color from "@tiptap/extension-color";
import { useEffect, useRef } from "react";
import styles from "@/styles/editor.module.css";
import {
  IconBold,
  IconItalic,
  IconStrikethrough,
  IconCode,
  IconList,
  IconListNumbers,
  IconBlockquote,
  IconMinus,
  IconArrowBackUp,
  IconArrowForwardUp,
} from "@tabler/icons-react";

export const MenuBar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  const buttons = [
    {
      icon: <IconBold size={16} />,
      tooltip: "Bold",
      isActive: editor.isActive("bold"),
      action: () => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: <IconItalic size={16} />,
      tooltip: "Italic",
      isActive: editor.isActive("italic"),
      action: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: <IconStrikethrough size={16} />,
      tooltip: "Strikethrough",
      isActive: editor.isActive("strike"),
      action: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      icon: <IconCode size={16} />,
      tooltip: "Inline Code",
      isActive: editor.isActive("code"),
      action: () => editor.chain().focus().toggleCode().run(),
    },
    {
      icon: <IconList size={16} />,
      tooltip: "Bullet List",
      isActive: editor.isActive("bulletList"),
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: <IconListNumbers size={16} />,
      tooltip: "Numbered List",
      isActive: editor.isActive("orderedList"),
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: <IconBlockquote size={16} />,
      tooltip: "Blockquote",
      isActive: editor.isActive("blockquote"),
      action: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      icon: <IconMinus size={16} />,
      tooltip: "Horizontal Rule",
      isActive: false,
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      icon: <IconArrowBackUp size={16} />,
      tooltip: "Undo",
      isActive: false,
      action: () => editor.chain().focus().undo().run(),
    },
    {
      icon: <IconArrowForwardUp size={16} />,
      tooltip: "Redo",
      isActive: false,
      action: () => editor.chain().focus().redo().run(),
    },
  ];
  

  return (
    <div className={styles.controlGroup}>
      <div className={styles.buttonGroup}>
        {buttons.map(({ icon, isActive, action, tooltip }, idx) => (
          <button
            key={idx}
            onClick={action}
            data-tooltip={tooltip}
            className={`${styles.button} ${isActive ? styles.buttonActive : ""}`}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );  
};

const extensions = [
    Color,
    StarterKit.configure({
      bulletList: { keepMarks: true },
      orderedList: { keepMarks: true },
    }),
    Placeholder.configure({
      placeholder: "Type your notes here...",
      emptyEditorClass: styles.placeholder,
    }),
];

export default function NoteEditor({
    content,
    onChange,
    onBlur,
  }: {
    content: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
  }) {
    const wrapperRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const handleBlur = (e: FocusEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.relatedTarget as Node)
        ) {
          onBlur?.();
        }
      };
  
      const node = wrapperRef.current;
      if (node) node.addEventListener("focusout", handleBlur);
      return () => {
        if (node) node.removeEventListener("focusout", handleBlur);
      };
    }, [onBlur]);
  
    return (
      <div ref={wrapperRef} className={styles.editorContainer}>
        <EditorProvider
          content={content}
          extensions={extensions}
          editorProps={{
            attributes: {
              class: styles.tiptap,
            },
          }}
          onUpdate={({ editor }) => onChange(editor.getHTML())}
          slotBefore={<MenuBar />}
        />
      </div>
    );
  }
  
