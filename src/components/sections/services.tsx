"use client";

import { SectionShell } from "@/components/section-shell";
import { site } from "@/content/site";
import { Check, Scissors, Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";

const categoryIcons = {
  "Cabello": Scissors,
  "Uñas": Sparkles,
  "Depilación": Heart,
};

export function Services() {
  const digits = site.socials.whatsapp.replace(/\D/g, "");
  const wa = `https://wa.me/${digits}`;

  return (
    <SectionShell
      id="servicios"
      eyebrow="Servicios"
      title="Todo lo que necesitás en un solo lugar"
      description="Seleccionamos técnicas y productos que cuidan tu piel y tu cabello. Consultá por disponibilidad y promos por WhatsApp."
      className="section-alt"
    >
      <div className="grid gap-6 md:grid-cols-3">
        {site.services.map((cat, idx) => {
          const IconComponent = categoryIcons[cat.category as keyof typeof categoryIcons];
          return (
            <motion.div 
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative card-animated-border"
            >
              
              <div className="relative rounded-[2rem] border-2 border-white/60 bg-black/90 p-7 shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col z-10">
                {/* Category header with icon */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{
                      background: idx === 0 
                        ? 'linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(201, 168, 76, 0.1))'
                        : idx === 1
                        ? 'linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(160, 128, 40, 0.1))'
                        : 'linear-gradient(135deg, rgba(160, 128, 40, 0.15), rgba(251, 191, 36, 0.1))'
                    }}
                  >
                    {IconComponent && (
                      <IconComponent className="h-6 w-6"
                        style={{
                          color: idx === 0 
                            ? 'rgb(201, 168, 76)'
                            : idx === 1
                            ? 'rgb(220, 188, 96)'
                            : 'rgb(160, 128, 40)'
                        }}
                      />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold font-[var(--font-playfair)]"
                    style={{
                      background: idx === 0 
                        ? 'linear-gradient(135deg, rgb(201, 168, 76), rgb(220, 188, 96))'
                        : idx === 1
                        ? 'linear-gradient(135deg, rgb(220, 188, 96), rgb(160, 128, 40))'
                        : 'linear-gradient(135deg, rgb(160, 128, 40), rgb(251, 191, 36))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {cat.category}
                  </h3>
                </div>

                {/* Service items */}
                <div className="space-y-4 flex-1">
                  {cat.items.map((it, itemIdx) => (
                    <motion.div 
                      key={it.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: idx * 0.1 + itemIdx * 0.05 }}
                      className="rounded-2xl p-4 hover:scale-105 transition-all duration-300 cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, rgba(30, 28, 20, 0.9), rgba(22, 20, 14, 0.95))',
                        border: '1px solid rgba(201, 168, 76, 0.2)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            background: idx === 0 
                              ? 'linear-gradient(135deg, rgb(201, 168, 76), rgb(220, 188, 96))'
                              : idx === 1
                              ? 'linear-gradient(135deg, rgb(220, 188, 96), rgb(160, 128, 40))'
                              : 'linear-gradient(135deg, rgb(160, 128, 40), rgb(251, 191, 36))'
                          }}
                        >
                          <Check className="h-4 w-4 text-white" strokeWidth={3} />
                        </span>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-stone-200">{it.name}</div>
                          <div className="mt-1 text-xs text-stone-400 leading-relaxed">{it.desc}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <a 
                  className="btn btn-primary mt-6 w-full group/btn" 
                  href={wa} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  <Sparkles className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                  Consultar por WhatsApp
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionShell>
  );
}
