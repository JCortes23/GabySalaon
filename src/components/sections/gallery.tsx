"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { SectionShell } from "@/components/section-shell";
import { site } from "@/content/site";
import { cn } from "@/components/utils";
import { X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const items = site.gallery;

  const current = useMemo(() => {
    if (active === null) return null;
    return items[active] ?? null;
  }, [active, items]);

  return (
    <SectionShell
      id="galeria"
      eyebrow="Galería"
      title="Trabajos recientes"
      description="Un vistazo a nuestros estilos."
    >
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        {items.map((img, idx) => (
          <motion.button
            key={img.src}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className={cn(
              "group relative overflow-hidden rounded-[2rem] border-2 border-white/60 bg-black/90 shadow-xl hover:shadow-2xl",
              "focus:outline-none focus:ring-4 focus:ring-yellow-600/50 transition-all duration-300"
            )}
            onClick={() => setActive(idx)}
            aria-label="Abrir imagen"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.25) 0%, rgba(160, 128, 40, 0.2) 100%)'
              }}
            />
            
            {/* Image */}
            <div className="relative overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                width={900}
                height={900}
                className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
              />
            </div>
            
            {/* Dark gradient at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Zoom icon */}
            <div className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/90/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
              <ZoomIn className="h-5 w-5 text-yellow-400" />
            </div>
                        
            {/* Shimmer effect */}
            <div className="absolute inset-0 z-30 shimmer opacity-0 group-hover:opacity-100" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {current ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="relative w-full max-w-5xl overflow-hidden rounded-[2.5rem] border-2 border-white/20 bg-black/90 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute right-5 top-5 z-10 rounded-2xl border-2 border-white/60 bg-black/90/95 backdrop-blur-sm p-3 hover:scale-110 transition-all duration-300 group/close"
                onClick={() => setActive(null)}
                aria-label="Cerrar"
                style={{
                  boxShadow: '0 4px 20px rgba(201, 168, 76, 0.3)'
                }}
              >
                <X className="h-5 w-5 text-yellow-400 group-hover/close:rotate-90 transition-transform" />
              </button>
              
              {/* Image container */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/30/20 via-transparent to-amber-100/20" />
                <Image
                  src={current.src}
                  alt={current.alt}
                  width={1400}
                  height={900}
                  className="h-[70vh] w-full object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SectionShell>
  );
}
