"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

export default function BlockNoteViewer({ content }: { content: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
  const [portalContainer] = useState(() => document.createElement("div"));

  const editor = useCreateBlockNote({
    initialContent: content,
  });

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Check if shadow root already exists before creating a new one
    let root: ShadowRoot;
    
    if (containerRef.current.shadowRoot) {
      // Use existing shadow root
      root = containerRef.current.shadowRoot;
      // Make sure portal container is in the shadow root
      if (!root.contains(portalContainer)) {
        root.appendChild(portalContainer);
      }
    } else {
      // Create new shadow root
      root = containerRef.current.attachShadow({ mode: "open" });
      
      // Add required styles to shadow DOM
      const style1 = document.createElement("link");
      style1.setAttribute("rel", "stylesheet");
      style1.setAttribute("href", "/_next/static/css/@blocknote/mantine/style.css");

      const style2 = document.createElement("link");
      style2.setAttribute("rel", "stylesheet");
      style2.setAttribute("href", "/_next/static/css/@blocknote/core/fonts/inter.css");

      root.appendChild(style1);
      root.appendChild(style2);
      root.appendChild(portalContainer);
    }
    
    setShadowRoot(root);

    return () => {
      // Clean up if component unmounts
      if (portalContainer.parentNode) {
        portalContainer.parentNode.removeChild(portalContainer);
      }
    };
  }, [portalContainer]);

  // Only render when shadowRoot is available
  if (!shadowRoot) {
    return <div ref={containerRef} />;
  }

  return (
    <div ref={containerRef}>
      {createPortal(
        <div className="prose max-w-none">
          <BlockNoteView editor={editor} editable={false} />
        </div>,
        portalContainer
      )}
    </div>
  );
}