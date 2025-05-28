"use client";

import { JSX, useEffect, useState } from "react";
import { Paper, ScrollArea, Loader } from "@mantine/core";
import { IconMessageCircle, IconNotes, IconListCheck, IconQuestionMark, IconInfoCircle } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { axiosClient } from "@/lib/axiosClient";
import { RootState } from "@/store/store";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface Context {
  _id: string;
  type: string;
  title?: string;
  content: string;
}

export function ScriptReader() {
  const campaignId = useSelector((state: RootState) => state.campaign.campaignId);
  const [contexts, setContexts] = useState<Context[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campaignId){
      console.log(campaignId);
      return;
    }
    setLoading(true);
    axiosClient
      .get(`/api/contexts/campaign/${campaignId}`)
      .then((res) => {
        const data = res.data;
        setContexts(data);
        if (data.length > 0) setActiveTab(data[0].type);
      })
      .catch((err) => console.error("Failed to fetch contexts:", err))
      .finally(() => setLoading(false));
  }, [campaignId]);

  const tabIcons: Record<string, JSX.Element> = {
    script: <IconMessageCircle size={16} />,
    objection: <IconNotes size={16} />,
    qualification: <IconListCheck size={16} />,
    faq: <IconQuestionMark size={16} />,
    competition: <IconInfoCircle size={16} />,
    custom: <IconNotes size={16} />,
  };

  const activeContext = contexts.find((ctx) => ctx.type === activeTab);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="h-full">
      <Paper className="h-[85vh] rounded-none flex flex-col overflow-hidden p-6 bg-darker my-10"
      style={{
        borderTopLeftRadius: "10px",
        borderBottomLeftRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        zIndex: 2,
        position: "relative",
        overflow: "hidden",
      }}
      >
        <div className="tabs-container flex gap-2">
          {contexts.map((ctx) => (
            <button
              key={ctx.type}
              className={`tab-item ${activeTab === ctx.type ? "active" : ""}`}
              onClick={() => setActiveTab(ctx.type)}
            >
              {tabIcons[ctx.type] || <IconNotes size={16} color="white"/>}
              <span className="ml-1 capitalize text-white">{ctx.title || ctx.type}</span>
            </button>
          ))}
        </div>

        <div className="tab-divider my-2 h-[1px] bg-darker" />

        {loading ? (
          <div className="flex justify-center items-center flex-1"><Loader /></div>
        ) : (
          <ScrollArea h="max-h-screen" scrollbarSize={6} type="auto" className="px-2 pb-6" style={{ padding: "30px", overflow: "auto" }}>
            <MarkdownBlock content={activeContext?.content || "No content available."} />
          </ScrollArea>
        )}
      </Paper>
    </motion.div>
  );
}

function MarkdownBlock({ content }: { content: string }) {
  return (
    <div className="markdown-content prose max-w-none bg-darker">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
