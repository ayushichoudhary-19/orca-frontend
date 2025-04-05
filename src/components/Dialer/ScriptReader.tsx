"use client";

import { Paper, Tabs, ScrollArea } from "@mantine/core";
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

const coldCallScript = `
## Cold Call Script

**Opener**  
Hey {{Name}}, this is *You* from **Uptut**, how are ya?

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

**"We're not internested right now"**  
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

export function ScriptReader() {
  const [activeTab, setActiveTab] = useState<string | null>("script");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full"
      style={{
        height: "100%",
      }}
    >
      <Paper className="h-full flex flex-col overflow-hidden p-2"
      style={{
       padding: '10px',
      }}
      >
        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          variant="pills"
          radius="xl"
          className="px-4 pt-4"
        >
          <Tabs.List mb="sm">
            <Tabs.Tab
              value="script"
              leftSection={<IconMessageCircle size={16} />}
            >
              Script
            </Tabs.Tab>
            <Tabs.Tab
              value="objections"
              leftSection={<IconNotes size={16} />}
            >
              Objections
            </Tabs.Tab>
            <Tabs.Tab
              value="questions"
              leftSection={<IconListCheck size={16} />}
            >
              Questions
            </Tabs.Tab>
          </Tabs.List>

          <ScrollArea
            h="calc(100vh - 270px)"
            scrollbarSize={6}
            type="auto"
            className="px-2 pb-6"
            style={{
              padding: '10px',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              overflow: 'auto',
              backgroundColor: '#f8f9fa',
            }}
          >
            <Tabs.Panel value="script">
              <MarkdownBlock content={coldCallScript} />
            </Tabs.Panel>
            <Tabs.Panel value="objections">
              <MarkdownBlock content={objectionHandling} />
            </Tabs.Panel>
            <Tabs.Panel value="questions">
              <MarkdownBlock content={qualificationQuestions} />
            </Tabs.Panel>
          </ScrollArea>
        </Tabs>
      </Paper>
    </motion.div>
  );
}

function MarkdownBlock({ content }: { content: string }) {
  return (
    <div className="prose max-w-none prose-violet">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
