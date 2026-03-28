import { site } from "@/content/site";
import { Heart, Sparkles } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t-2 border-yellow-900/30 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 251, 254, 1) 0%, rgba(255, 247, 252, 1) 100%)'
      }}
    >
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 left-[10%] w-32 h-32 bg-gradient-to-br from-yellow-800/40/30 to-amber-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-[15%] w-40 h-40 bg-gradient-to-br from-yellow-200/25 to-yellow-800/40/25 rounded-full blur-3xl" />
      
      <div className="mx-auto max-w-6xl px-5 py-12 relative z-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          {/* Logo and tagline */}
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgb(201, 168, 76), rgb(220, 188, 96))'
              }}
            >
              <img
                src="/images/hero.png"
                alt="Logo Gaby Salón y Spa"
                className="h-8 w-8 object-contain"
              />
            </div>

            <div>
              <div className="text-base font-bold bg-gradient-to-r from-yellow-400 to-yellow-400 bg-clip-text text-transparent">
                {site.name}
              </div>
              <div className="text-xs text-stone-400 mt-0.5">
                {site.tagline}
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="flex flex-col items-start md:items-end gap-2">
            <div className="text-sm text-stone-400 flex items-center gap-2">
              Hecho por Sheila Espinoza
            </div>
            <div className="text-xs text-stone-400">
              © {year} {site.name}.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
