"use client";

import { SectionShell } from "@/components/section-shell";
import { site } from "@/content/site";
import { Sparkles, ShieldCheck, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

const perks = [
  {
    icon: Sparkles,
    title: "Resultados que enamoran",
    desc: "Detalles finos, acabados limpios y estilo actual.",
    gradient: "from-yellow-500 to-yellow-500"
  },
  {
    icon: ShieldCheck,
    title: "Cuidado e higiene",
    desc: "Herramientas desinfectadas y protocolos consistentes.",
    gradient: "from-yellow-400 to-stone-9000"
  },
  {
    icon: HeartHandshake,
    title: "Trato cercano",
    desc: "Te escuchamos y te recomendamos lo mejor para vos.",
    gradient: "from-yellow-500 to-yellow-400"
  },
];

export function About() {
  return (
    <SectionShell
      id="quienes"
      eyebrow="Quiénes somos"
      title={`Bienvenid@ a ${site.name}`}
      description="Somos un salón enfocado en realzar tu belleza con un servicio cálido, profesional y moderno. Nuestro objetivo es que salgás feliz, segura y con ganas de volver."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {perks.map((p, idx) => (
          <motion.div 
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group relative card-animated-border"
          >
            
            <div className="relative rounded-[2rem] border-2 border-white/60 bg-black/90 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full z-10">
              {/* Icon container */}
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{
                  background: idx === 0 
                    ? 'linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(201, 168, 76, 0.1))'
                    : idx === 1
                    ? 'linear-gradient(135deg, rgba(160, 128, 40, 0.15), rgba(201, 168, 76, 0.1))'
                    : 'linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(160, 128, 40, 0.1))'
                }}
              >
                <p.icon 
                  className="h-8 w-8"
                  style={{
                    color: idx === 0 
                      ? 'rgb(201, 168, 76)'
                      : idx === 1
                      ? 'rgb(160, 128, 40)'
                      : 'rgb(201, 168, 76)'
                  }}
                />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold mb-3"
                style={{
                  background: idx === 0 
                    ? 'linear-gradient(135deg, rgb(201, 168, 76), rgb(220, 188, 96))'
                    : idx === 1
                    ? 'linear-gradient(135deg, rgb(160, 128, 40), rgb(220, 188, 96))'
                    : 'linear-gradient(135deg, rgb(201, 168, 76), rgb(220, 188, 96))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {p.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-stone-400 leading-relaxed">
                {p.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}
