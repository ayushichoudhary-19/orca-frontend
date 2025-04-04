'use client';
import { Paper } from '@mantine/core';
import ReactMarkdown from 'react-markdown';

const script = `
## Cold Call Script

**Opener**  
Hey {{Name}}, this is *You* from **Uptut**, how are ya?

**Permission Ask**  
If I give you a 27-second spiel and it sounds useful, we can chat. If not, feel free to hang up. Does that sound fair?

**Pitch**  
We help teams like yours...

> Adapt this script to your tone and personality!
`;

export default function ScriptReader() {
  return (
    <Paper radius="lg" p="md" shadow="sm" className="bg-white/10 text-black overflow-y-auto h-full min-h-[300px]">
      <ReactMarkdown>{script}</ReactMarkdown>
    </Paper>
  );
}
