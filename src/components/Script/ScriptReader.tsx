"use client";

import { Paper, ScrollArea } from "@mantine/core";
import {
  IconMessageCircle,
  IconNotes,
  IconListCheck,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Contact } from "../Contacts/ContactList";

function replacePlaceholders(template: string, contact?: Contact) {
  return template
    .replace(/\{\{Name\}\}/gi, contact?.name || "{{name}}")
    .replace(/\{\{Email\}\}/gi, contact?.email || "{{email}}")
    .replace(/\{\{Address\}\}/gi, contact?.address || "{{address}}")
    .replace(/\{\{Number\}\}/gi, contact?.number || "{{number}}")
}

const coldCallScript = `
## Cold Call Script

**Opener**  
Hey {{Name}}, this is *You* from **Uptut**, how are ya?

**Verification**
If I am not wrong, you currently live in **{{Address}}**.
Can you confirm that this is your current address?
Also, if we want to reach you, is {{Email}} your current email address?

**Permission Ask**  
If I give you a 27-second spiel and it sounds useful, we can chat. If not, feel free to hang up. Does that sound fair?

**Pitch**  
We help teams like yours improve their sales process through AI-powered coaching and real-time feedback.

**Value Proposition**  
Our clients typically see a 30% increase in conversion rates within the first 3 months.

> Adapt this script to your tone and personality!
`;

const objectionHandling = `
## Objection Handling

**"We're not interested right now"**  
- I understand. Many of our current clients felt the same way initially. What specific concerns do you have about exploring this further?

**"We don't have budget"**  
- I appreciate that budget constraints are real. Our solution actually helps reduce costs by improving efficiency. Would it make sense to discuss how this could work within your current financial framework?

**"We already have a solution"**  
- That's great! I'd love to learn more about what you're currently using. Many of our clients found that our solution complemented their existing tools by addressing gaps in...
`;

const qualificationQuestions = `
## Qualification Questions

1. What's your current sales process like?  
2. How many sales reps do you have on your team?  
3. What are your biggest challenges in the sales process right now?  
4. How do you currently train and coach your sales team?  
5. What would a successful outcome look like for you?  
6. Who else would be involved in the decision-making process?  
7. What's your timeline for implementing a solution like this?
`;

export function ScriptReader({ contact }: { contact?: Contact }) {
  const [activeTab, setActiveTab] = useState<string>("script");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Paper
        className="h-full rounded-none flex flex-col overflow-hidden p-6 border-l border-l-[#edeeef]"
        style={{ backgroundColor: "#f9fcfe" }}
      >
        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-item ${activeTab === "script" ? "active" : ""}`}
            onClick={() => setActiveTab("script")}
          >
            <IconMessageCircle size={16} className="tab-icon" />
            <span>Script</span>
          </button>
          <button
            className={`tab-item ${activeTab === "objections" ? "active" : ""}`}
            onClick={() => setActiveTab("objections")}
          >
            <IconNotes size={16} className="tab-icon" />
            <span>Objection Handling</span>
          </button>
          <button
            className={`tab-item ${activeTab === "questions" ? "active" : ""}`}
            onClick={() => setActiveTab("questions")}
          >
            <IconListCheck size={16} className="tab-icon" />
            <span>Questions</span>
          </button>
        </div>
        <div className="tab-divider"></div>

        {/* Markdown Content */}
        <ScrollArea
          h="max-h-screen"
          scrollbarSize={6}
          type="auto"
          className="px-2 pb-6"
          style={{
            padding: "30px",
            borderRadius: "12px 0 0 12px",
            overflow: "auto",
            backgroundColor: "#f9fcfe",
          }}
        >
          {activeTab === "script" && (
            <MarkdownBlock content={replacePlaceholders(coldCallScript, contact)} />
          )}
          {activeTab === "objections" && <MarkdownBlock content={objectionHandling} />}
          {activeTab === "questions" && <MarkdownBlock content={qualificationQuestions} />}
        </ScrollArea>
      </Paper>
    </motion.div>
  );
}

function MarkdownBlock({ content }: { content: string }) {
  return (
    <div className="markdown-content prose max-w-none" style={{ backgroundColor: "#f9fcfe" }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}