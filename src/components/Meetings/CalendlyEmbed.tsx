import React from 'react';

interface CalendlyEmbedProps {
  link: string;
}

const CalendlyEmbed: React.FC<CalendlyEmbedProps> = ({ link }) => (
  <iframe
    src={link}
    width="100%"
    height="700"
    frameBorder="0"
    style={{ border: 'none' }}
  />
);

export default CalendlyEmbed;
