"use client";

import { site } from "@/content/site";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function WhatsAppFloating() {
  const digits = site.socials.whatsapp.replace(/\D/g, "");
  const href = `https://wa.me/${digits}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 rounded-full px-5 py-4 text-sm font-bold text-white shadow-2xl hover:shadow-stone-9000/50 transition-all duration-300 group"
      style={{
        background: 'linear-gradient(135deg, rgb(201, 168, 76), rgb(220, 188, 96), rgb(160, 128, 40))'
      }}
      aria-label="Abrir WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5 
      }}
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full animate-ping opacity-30"
        style={{
          background: 'linear-gradient(135deg, rgb(201, 168, 76), rgb(160, 128, 40))'
        }}
      />
      
      {/* Icon */}
      <MessageCircle className="h-6 w-6 relative z-10 group-hover:rotate-12 transition-transform" />
      
      {/* Text */}
      <span className="relative z-10">WhatsApp</span>
    </motion.a>
  );
}
