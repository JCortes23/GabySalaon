"use client";

// Combobox personalizado para elegir un servicio.
// Se ve mejor que el <select> nativo y combina con el tema oscuro/dorado.
import { useEffect, useRef, useState } from "react";
import type { ServiceGroup } from "@/lib/services";
import { ChevronDown, Check, Scissors } from "lucide-react";

export function ServicePicker({
  groups,
  value,
  onChange,
  placeholder = "Elegí un servicio",
}: {
  groups: ServiceGroup[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Buscar el servicio seleccionado para mostrarlo en el botón.
  let seleccionado = null as null | { name: string; price: number; category: string };
  for (const g of groups) {
    for (const s of g.items) {
      if (s.id === value) seleccionado = { name: s.name, price: s.price, category: g.category };
    }
  }

  // Cerrar el desplegable al hacer clic afuera.
  useEffect(() => {
    function alClicAfuera(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", alClicAfuera);
    return () => document.removeEventListener("mousedown", alClicAfuera);
  }, []);

  return (
    <div ref={boxRef} className="relative">
      {/* Botón que abre el desplegable */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-2xl border border-yellow-800/40 bg-black/60 px-4 py-3 text-left text-sm outline-none transition-colors hover:border-yellow-600 focus:border-yellow-500"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-yellow-900/30">
          <Scissors className="h-4 w-4 text-yellow-500" />
        </span>
        <span className="flex-1">
          {seleccionado ? (
            <>
              <span className="block font-semibold text-stone-100">{seleccionado.name}</span>
              <span className="block text-xs text-stone-500">{seleccionado.category}</span>
            </>
          ) : (
            <span className="text-stone-500">{placeholder}</span>
          )}
        </span>
        {seleccionado && seleccionado.price > 0 && (
          <span className="shrink-0 text-sm font-bold text-yellow-400">
            ₡{seleccionado.price.toLocaleString("es-CR")}
          </span>
        )}
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-yellow-600 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Lista desplegable */}
      {open && (
        <div className="glass-premium absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl p-2 shadow-2xl">
          {groups.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-stone-500">No hay servicios.</div>
          ) : (
            groups.map((g) => (
              <div key={g.category} className="mb-1">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-yellow-500">
                  {g.category}
                </div>
                {g.items.map((s) => {
                  const activo = s.id === value;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        onChange(s.id);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                        activo ? "bg-yellow-900/30 text-yellow-300" : "text-stone-200 hover:bg-white/5"
                      }`}
                    >
                      <span className="flex-1 font-medium">{s.name}</span>
                      {s.price > 0 && (
                        <span className="text-xs font-semibold text-yellow-400">
                          ₡{s.price.toLocaleString("es-CR")}
                        </span>
                      )}
                      {activo && <Check className="h-4 w-4 text-yellow-400" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
