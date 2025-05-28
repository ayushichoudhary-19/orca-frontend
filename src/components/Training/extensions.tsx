import {
  TiptapImage,
  TiptapLink,
  UpdatedImage,
  TaskList,
  TaskItem,
  HorizontalRule,
  StarterKit,
  Placeholder,
} from "novel";
import { createSuggestionItems, Command, renderItems } from "novel";
import {
  IconSquareCheck,
  IconCode,
  IconH1,
  IconH2,
  IconH3,
  IconList,
  IconListNumbers,
  IconTextIncrease,
  IconQuote,
} from "@tabler/icons-react";

const placeholder = Placeholder.configure({
  placeholder: "Enter text or type '/' for commands...",
  showOnlyWhenEditable: true,
  emptyEditorClass: "is-editor-empty",
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: "not-prose pl-2 space-y-1",
  },
});

const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: "flex items-center gap-2",
  },
  nested: true,
});

const starterKit = StarterKit.configure({
  listItem: {
    HTMLAttributes: {
      class: "my-1 leading-snug",
    },
  },
  bulletList: {
    HTMLAttributes: {
      class: "list-disc pl-5 space-y-1",
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: "list-decimal pl-5 space-y-1",
    },
  },
});

const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class:
      "text-gray-500 underline underline-offset-[3px] hover:text-violet-600 transition-colors cursor-pointer",
  },
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: "mt-4 mb-6 border-t border-gray-300",
  },
});

export const suggestionItems = createSuggestionItems([
  {
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: <IconTextIncrease size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
    },
  },
  {
    title: "To-do List",
    description: "Track tasks with a to-do list.",
    searchTerms: ["todo", "task", "list", "check", "checkbox"],
    icon: <IconSquareCheck size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    searchTerms: ["title", "big", "large"],
    icon: <IconH1 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium"],
    icon: <IconH2 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small"],
    icon: <IconH3 size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["unordered", "point"],
    icon: <IconList size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering.",
    searchTerms: ["ordered"],
    icon: <IconListNumbers size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Quote",
    description: "Capture a quote.",
    searchTerms: ["blockquote"],
    icon: <IconQuote size={18} />,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .toggleBlockquote()
        .run(),
  },
  {
    title: "Code",
    description: "Capture a code snippet.",
    searchTerms: ["codeblock"],
    icon: <IconCode size={18} />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
]);

export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});

export const defaultExtensions = [
  starterKit,
  placeholder,
  tiptapLink,
  TiptapImage,
  UpdatedImage,
  taskList,
  taskItem,
  horizontalRule,
  slashCommand,
];
