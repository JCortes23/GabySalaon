"use client";

import { useEffect, useMemo, useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/components/utils";
import { Instagram, Facebook, Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Inicio", href: "#inicio" },
  { label: "Quiénes somos", href: "#quienes" },
  { label: "Servicios", href: "#servicios" },
  { label: "Galería", href: "#galeria" },
  { label: "Contacto", href: "#contacto" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const whatsappHref = useMemo(() => {
    const digits = site.socials.whatsapp.replace(/\D/g, "");
    return `https://wa.me/${digits}`;
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", site.accents.accent);
    document.documentElement.style.setProperty("--accent2", site.accents.accent2);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled 
          ? "bg-black/90 backdrop-blur-2xl border-b border-yellow-900/30 shadow-lg shadow-black/50" 
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-3 group">
          <div className="relative">
            <div
              className="absolute -inset-1 rounded-2xl opacity-75 blur-md group-hover:opacity-100 transition-opacity"
              style={{
                background: 'linear-gradient(135deg, rgb(201, 168, 76), rgb(160, 128, 40))'
              }}
            />

            <div
              className="relative h-11 w-11 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgb(20, 20, 14), rgb(30, 30, 20))'
              }}
            >
              <img
                src="/images/hero.png"
                alt="Logo Gaby Salón y Spa"
                className="h-6 w-6 object-contain"
              />
            </div>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              {site.name}
            </div>
            <div className="text-xs text-stone-400">{site.tagline.split('.')[0]}</div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a 
              key={l.href} 
              href={l.href} 
              className="text-sm font-medium text-stone-400 hover:text-yellow-400 transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary text-xs"
            aria-label="Contactar por WhatsApp"
          >
            <Sparkles className="h-3.5 w-3.5" />
            WhatsApp
          </a>
          <div className="flex items-center gap-2">
            <a
              className="rounded-xl p-2.5 hover:bg-yellow-900/20 transition-colors group"
              href={site.socials.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 text-stone-400 group-hover:text-yellow-400 transition-colors" />
            </a>
            <a
              className="rounded-xl p-2.5 hover:bg-yellow-900/20 transition-colors group"
              href={site.socials.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5 text-stone-400 group-hover:text-yellow-400 transition-colors" />
            </a>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden rounded-2xl border-2 border-yellow-800/40 bg-black/90/90 p-2.5 hover:bg-yellow-900/20 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {open ? 
            <X className="h-5 w-5 text-yellow-400" /> : 
            <Menu className="h-5 w-5 text-yellow-400" />
          }
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-yellow-900/30 bg-black/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="mx-auto max-w-6xl px-5 py-5">
              <div className="flex flex-col gap-4">
                {links.map((l, idx) => (
                  <motion.a
                    key={l.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    href={l.href}
                    className="text-sm font-medium text-stone-300 hover:text-yellow-400 transition-colors py-2"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </motion.a>
                ))}
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary w-full mt-2"
                  onClick={() => setOpen(false)}
                >
                  <Sparkles className="h-4 w-4" />
                  WhatsApp
                </motion.a>
                <div className="flex items-center gap-3 pt-2 border-t border-yellow-900/30 mt-2">
                  <a
                    className="rounded-xl p-2.5 hover:bg-yellow-900/20 transition-colors"
                    href={site.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Instagram className="h-5 w-5 text-stone-400" />
                  </a>
                  <a
                    className="rounded-xl p-2.5 hover:bg-yellow-900/20 transition-colors"
                    href={site.socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Facebook className="h-5 w-5 text-stone-400" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
