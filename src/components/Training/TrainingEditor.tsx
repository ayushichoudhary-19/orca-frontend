"use client";

import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect } from "react";

interface Props {
  content: any;
  onSave: (content: any) => void;
  handleUpload: (file: File) => Promise<string | null>;
  onChange: (content: any) => void;
}

export default function TrainingEditor({ content, handleUpload, onChange }: Props) {
  const editor = useCreateBlockNote({
    initialContent: content,
    uploadFile: handleUpload,
  });

  useEffect(() => {
    if (editor && content) {
      editor.replaceBlocks(editor.document, content);
    }
  }, [editor, content]);

  return (
    <div>
      <BlockNoteView
        editor={editor}
        onChange={() => {
          const newContent = editor.document;
          onChange(newContent);
        }}
      />
    </div>
  );
}
