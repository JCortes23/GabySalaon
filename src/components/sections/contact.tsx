"use client";

import { SectionShell } from "@/components/section-shell";
import { site } from "@/content/site";
import { Mail, MapPin, Phone, Instagram, Facebook, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Contact() {
  const digits = site.socials.whatsapp.replace(/\D/g, "");
  const wa = `https://wa.me/${digits}`;

  return (
    <SectionShell
      id="contacto"
      eyebrow="Contacto"
      title="Reservá o consultá en segundos"
      description="Escribinos por WhatsApp o encontranos en nuestras redes. Estamos listos para atenderte."
      className="section-alt"
    >
      <div className="grid gap-6 md:grid-cols-5">
        {/* Left Column - Contact Info */}
        <div className="md:col-span-2 space-y-5">
          {/* Contact Information Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border-2 border-white/60 bg-black/90 p-7 shadow-xl"
          >
            <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-400 bg-clip-text text-transparent mb-6">
              Información
            </h3>
            
            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-stone-900/50 transition-colors">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-900/30 to-stone-900 shrink-0">
                  <MapPin className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-stone-200">Dirección</div>
                  <div className="text-sm text-stone-400 mt-1">{site.contact.address}</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-stone-900/50 transition-colors">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-900/30 to-zinc-900 shrink-0">
                  <Mail className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-stone-200">Correo</div>
                  <a 
                    className="text-sm text-stone-400 hover:text-yellow-400 transition-colors mt-1 inline-block" 
                    href={`mailto:${site.contact.email}`}
                  >
                    {site.contact.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-stone-900/50 transition-colors">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-900/30 to-zinc-900 shrink-0">
                  <Phone className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-stone-200">Teléfono</div>
                  <a 
                    className="text-sm text-stone-400 hover:text-yellow-400 transition-colors mt-1 inline-block" 
                    href={`tel:${site.contact.phone}`}
                  >
                    {site.contact.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* WhatsApp Button */}
            <a className="btn btn-primary mt-6 w-full" href={wa} target="_blank" rel="noreferrer">
              <Sparkles className="h-4 w-4" />
              Abrir WhatsApp
            </a>

            {/* Social Media Buttons */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-yellow-700/50 bg-zinc-900 px-4 py-3 text-sm font-bold text-yellow-400 hover:border-yellow-500 hover:bg-zinc-800 transition-all"
                href={site.socials.instagram}
                target="_blank"
                rel="noreferrer"
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
              <a
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-yellow-700/50 bg-zinc-900 px-4 py-3 text-sm font-bold text-yellow-400 hover:border-yellow-500 hover:bg-zinc-800 transition-all"
                href={site.socials.facebook}
                target="_blank"
                rel="noreferrer"
              >
                <Facebook className="h-4 w-4" /> Facebook
              </a>
            </div>
          </motion.div>

          {/* Hours Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[2rem] border-2 border-white/60 bg-black/90 p-7 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-900/30 to-zinc-900">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                Horarios
              </h3>
            </div>
            
            <div className="space-y-3">
              {site.contact.hours.map((h, idx) => (
                <motion.div 
                  key={h.day}
                  initial={{ opacity: 0, y: 5 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
                  className="flex items-center justify-between rounded-2xl p-4 hover:scale-[1.02] transition-transform"
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 28, 20, 0.9), rgba(22, 20, 14, 0.95))',
                    border: '1px solid rgba(201, 168, 76, 0.15)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div className="text-sm font-bold text-stone-200">{h.day}</div>
                  <div className="text-sm text-stone-400">{h.time}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Map */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-3 relative group h-full"
        >
          {/* Map glow effect */}
          <div className="absolute -inset-1 rounded-[2rem] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none z-0"
            style={{
              background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.3), rgba(160, 128, 40, 0.2))'
            }}
          />
          
          {/* Map container - takes full height */}
          <div className="relative h-full min-h-[500px] overflow-hidden rounded-[2rem] border-2 border-white/60 bg-black/90 shadow-xl">
            <iframe
              title="Mapa"
              src={site.contact.mapsEmbedUrl}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ display: 'block' }}
            />
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}
