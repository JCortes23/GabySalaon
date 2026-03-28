"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { site } from "@/content/site";
import { Sparkles, Star, Heart } from "lucide-react";

export function Hero() {
  const digits = site.socials.whatsapp.replace(/\D/g, "");
  const wa = `https://wa.me/${digits}`;

  return (
    <section id="inicio" className="gradient-hero relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-[10%] w-20 h-20 bg-gradient-to-br from-yellow-600/30 to-yellow-600/30 rounded-full blur-2xl animate-pulse" />
      <div className="absolute top-40 right-[15%] w-32 h-32 bg-gradient-to-br from-amber-300/20 to-yellow-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-[20%] w-24 h-24 bg-gradient-to-br from-yellow-300/25 to-yellow-600/25 rounded-full blur-2xl animate-pulse delay-500" />
      
      {/* Floating emoji particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute top-24 left-[8%] text-3xl animate-float opacity-60">✨</span>
        <span className="absolute top-32 right-[12%] text-2xl animate-float-delayed opacity-50">💅</span>
        <span className="absolute bottom-40 left-[15%] text-2xl animate-float-delayed-2 opacity-60">💖</span>
        <span className="absolute top-[60%] right-[20%] text-xl animate-float opacity-50">🌸</span>
        <span className="absolute bottom-24 right-[8%] text-2xl animate-float-delayed opacity-60">✨</span>
        <span className="absolute top-[45%] left-[5%] text-xl animate-float-delayed-2 opacity-50">💫</span>
      </div>
      
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 md:pb-20 md:pt-14 relative z-10">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            {/* Badges */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6 flex flex-wrap gap-2"
            >
              <span className="badge">
                <Sparkles className="w-3 h-3" />
                Atención personalizada
              </span>
              <span className="badge">
                <Star className="w-3 h-3" />
                Diseños modernos
              </span>
              <span className="badge">
                <Heart className="w-3 h-3" />
                Ambiente premium
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl font-bold tracking-tight md:text-7xl font-[var(--font-playfair)] mb-6 gradient-wave"
            >
              {site.tagline}
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg max-w-xl leading-relaxed text-stone-300"
            >
              {site.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <a className="btn btn-primary" href={wa} target="_blank" rel="noreferrer">
                <Sparkles className="w-4 h-4" />
                Reservar por WhatsApp
              </a>
              <a className="btn btn-secondary" href="#servicios">
                Ver servicios
              </a>
            </motion.div>

            {/* Highlights */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {site.highlights.map((h, idx) => (
                <motion.div 
                  key={h.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                  className="glass-premium rounded-2xl p-5 hover:scale-105 transition-transform duration-300 cursor-pointer group"
                >
                  <div className="text-sm font-bold text-yellow-400 group-hover:text-yellow-400 transition-colors">
                    {h.title}
                  </div>
                  <div className="mt-2 text-xs text-stone-400 leading-relaxed">
                    {h.desc}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Image section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Gradient glow */}
            <div className="absolute -inset-4 rounded-[2.5rem] opacity-60 blur-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.4) 0%, rgba(201, 168, 76, 0.3) 50%, rgba(160, 128, 40, 0.35) 100%)'
              }}
            />
            
            {/* Main image container */}
            <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-white/60 bg-black/90 shadow-2xl shimmer">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/30/40 via-transparent to-amber-100/40" />
              <Image
                src="/images/hero.png"
                alt="Salón de belleza"
                width={900}
                height={700}
                priority
                className="h-auto w-full relative z-10"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
