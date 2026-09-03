"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CatRiveCanvas from "./CatRiveCanvas";
import ParticleCanvas from "./ParticleCanvas";
import AgentChatModal from "./AgentChatModal";

interface FooterCatInstanceProps {
  onActivate?: () => void;
}

export default function FooterCatInstance({ onActivate }: FooterCatInstanceProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setParticleTrigger(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const handleActivate = () => {
    if (onActivate) {
      onActivate();
    } else {
      setIsChatOpen(true);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.3 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <div
          className="relative pointer-events-auto flex items-center justify-center w-[75%] max-w-[140px] aspect-square"
        >
          <ParticleCanvas trigger={particleTrigger} size={140} />
          <CatRiveCanvas
            onActivate={handleActivate}
            className="w-full h-full drop-shadow-lg"
            ariaLabel="Cat nestled inside O — click or press Enter to chat."
          />
        </div>
      </motion.div>

      <AgentChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
