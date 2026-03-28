"use client";

import { SectionShell } from "@/components/section-shell";
import { site } from "@/content/site";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % site.testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + site.testimonials.length) % site.testimonials.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % site.testimonials.length);
  };

  return (
    <SectionShell
      eyebrow="Testimonios"
      title="Lo que dicen nuestras clientas"
      description="Lo que opinan nuestras clientas"
      className="section-alt"
    >
      <div className="relative max-w-4xl mx-auto">
        {/* Carousel Container */}
        <div className="relative overflow-hidden min-h-[320px] md:min-h-[280px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0"
            >
              <div className="group relative card-animated-border h-full">
                <div className="relative rounded-[2rem] border-2 border-white/60 bg-black/90 p-8 md:p-10 shadow-xl h-full flex flex-col z-10">
                  {/* Quote icon and stars */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(201, 168, 76, 0.1))'
                      }}
                    >
                      <Quote className="h-7 w-7 text-stone-9000" fill="currentColor" />
                    </div>
                    
                    {/* 5 star rating */}
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className="h-5 w-5 text-amber-400" 
                          fill="currentColor"
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Testimonial text */}
                  <p className="text-lg md:text-xl leading-relaxed text-stone-300 flex-1 italic mb-6">
                    "{site.testimonials[currentIndex].text}"
                  </p>
                  
                  {/* Client name */}
                  <div className="pt-6 border-t-2"
                    style={{
                      borderColor: 'rgba(201, 168, 76, 0.15)'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar placeholder */}
                      <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{
                          background: 'linear-gradient(135deg, rgb(201, 168, 76), rgb(220, 188, 96))'
                        }}
                      >
                        {site.testimonials[currentIndex].name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-base font-bold text-stone-200">
                          {site.testimonials[currentIndex].name}
                        </div>
                        <div className="text-sm text-stone-400">Cliente verificada</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            className="group flex h-12 w-12 items-center justify-center rounded-full border-2 border-yellow-800/40 bg-black/90 hover:bg-stone-900 transition-all duration-300 hover:scale-110"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6 text-yellow-400 group-hover:text-yellow-500" />
          </button>

          {/* Dots indicator */}
          <div className="flex gap-2">
            {site.testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'w-8 bg-gradient-to-r from-stone-9000 to-yellow-400' 
                    : 'w-2.5 bg-yellow-800/40 hover:bg-yellow-600'
                }`}
                aria-label={`Ir a testimonio ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="group flex h-12 w-12 items-center justify-center rounded-full border-2 border-yellow-800/40 bg-black/90 hover:bg-stone-900 transition-all duration-300 hover:scale-110"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6 text-yellow-400 group-hover:text-yellow-500" />
          </button>
        </div>
      </div>
    </SectionShell>
  );
}
