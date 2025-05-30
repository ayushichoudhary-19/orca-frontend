"use client";

import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect } from "react";

interface Props {
  content: any[] | null;
  onSave?: (content: any) => void;
  handleUpload: (file: File) => Promise<string | null>;
  onChange: (content: any) => void;
}

export default function TrainingEditor({ content, handleUpload, onChange }: Props) {
  const editor = useCreateBlockNote({
    initialContent: (Array.isArray(content) && content.length > 0) ? content : undefined,
    uploadFile: async (file: File) => {
      const result = await handleUpload(file);
      return result ?? '';
    },
  });

  useEffect(() => {
    if (editor) {
      const blocksToLoad = Array.isArray(content) ? content : [];
      
      editor.replaceBlocks(editor.document, blocksToLoad);
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