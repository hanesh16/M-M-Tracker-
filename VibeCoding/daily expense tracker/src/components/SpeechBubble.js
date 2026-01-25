import React, { useEffect, useState } from 'react';

const SpeechBubble = ({ messages, interval = 3200 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, interval);
    return () => clearInterval(id);
  }, [interval, messages.length]);

  return (
    <div className="speech-bubble text-sm md:text-base">
      {messages[index]}
    </div>
  );
};

export default SpeechBubble;
