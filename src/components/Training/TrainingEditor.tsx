"use client";

import { useState } from "react";
import { EditorRoot, EditorContent, EditorInstance, EditorCommand, EditorCommandEmpty, EditorCommandList, EditorCommandItem } from "novel";
import { useDebouncedCallback } from "use-debounce";
import { handleCommandNavigation } from "novel";
import { defaultExtensions, suggestionItems } from "./extensions";
import { Card, Button, Text } from "@mantine/core";
import { JSONContent } from "@tiptap/core";

interface Props {
  initialContent?: JSONContent;
  onSave?: (data: { content: JSONContent }) => void;
}

const defaultContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "" }],
    },
  ],
};

export default function TrainingRichEditor({
  initialContent = defaultContent,
  onSave,
}: Props) {
  const [content, setContent] = useState<JSONContent>(initialContent);
  const [saveStatus, setSaveStatus] = useState("Saved");

  const debouncedUpdate = useDebouncedCallback((editor: EditorInstance) => {
    const json = editor.getJSON();
    setContent(json);
    setSaveStatus("Saved");
    onSave?.({ content: json });
  }, 500);  

  return (
    <Card padding="xl" radius="md"
    bg={'transparent'}
    >
      <div className="mb-3 flex items-center justify-end">

        <Text size="xs" className="text-gray-400">{saveStatus}</Text>
      </div>

      <EditorRoot>
        <EditorContent
          extensions={defaultExtensions}
          initialContent={initialContent}
          onUpdate={({ editor }) => {
            setSaveStatus("Saving...");
            debouncedUpdate(editor);
          }}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            attributes: {
              class:
                "prose prose-lg max-w-full focus:outline-none prose-headings:font-semibold min-h-[150px]",
            },
          }}
        />
        <EditorCommand className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-muted bg-white px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-gray-500">No results</EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
            <EditorCommandItem
                key={item.title}
                value={item.title}
                onCommand={(val) => item.command && item.command(val)}
                className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-200 focus:bg-gray-200 transition-colors"
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white">
                    {item.icon}
                </div>
                <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                </div>
            </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>
      </EditorRoot>

      <div className="mt-6 flex justify-end">
      <Button onClick={() => onSave?.({ content })}>
        Save & Publish
      </Button>
      </div>
    </Card>
  );
}
