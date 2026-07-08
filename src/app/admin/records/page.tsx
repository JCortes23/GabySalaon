"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { fetchActiveServices, groupByCategory, type Service } from "@/lib/services";
import {
  addRecord,
  fetchRecordsByDate,
  deleteRecord,
  todayStr,
  type ServiceRecord,
} from "@/lib/records";
import {
  Loader2,
  Plus,
  Trash2,
  ArrowLeft,
  ClipboardList,
  Calendar,
} from "lucide-react";

export default function AdminRecordsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const [services, setServices] = useState<Service[]>([]);
  const [date, setDate] = useState<string>(todayStr());
  const [serviceId, setServiceId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [note, setNote] = useState<string>("");

  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Guardia de sesión.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.replace("/admin/login");
      else setChecking(false);
    });
    return () => unsub();
  }, [router]);

  // Cargar servicios activos (una vez).
  useEffect(() => {
    if (checking) return;
    (async () => {
      try {
        const list = await fetchActiveServices();
        setServices(list);
      } catch {
        setError("No se pudieron cargar los servicios. Revisá la configuración de Firestore.");
      }
    })();
  }, [checking]);

  // Cargar registros del día seleccionado.
  const loadRecords = async (d: string) => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchRecordsByDate(d);
      list.sort((a, b) => a.serviceName.localeCompare(b.serviceName));
      setRecords(list);
    } catch {
      setError("No se pudieron cargar los registros. Revisá que Firestore esté creado.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!checking) loadRecords(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking, date]);

  const serviceGroups = useMemo(() => groupByCategory(services), [services]);

  const dayTotals = useMemo(() => {
    const count = records.reduce((sum, r) => sum + (r.quantity || 0), 0);
    const revenue = records.reduce((sum, r) => sum + (r.price || 0) * (r.quantity || 0), 0);
    return { count, revenue };
  }, [records]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const qty = Number(quantity);
    const svc = services.find((s) => s.id === serviceId);
    if (!svc) {
      setMsg("Seleccioná un servicio.");
      return;
    }
    if (Number.isNaN(qty) || qty < 1) {
      setMsg("La cantidad debe ser al menos 1.");
      return;
    }
    setSaving(true);
    try {
      await addRecord({
        date,
        serviceId: svc.id,
        serviceName: svc.name,
        category: svc.category,
        price: svc.price,
        quantity: qty,
        note: note.trim() || "",
      });
      setNote("");
      setQuantity("1");
      await loadRecords(date);
    } catch {
      setMsg("No se pudo registrar. Revisá permisos de Firestore y tu conexión.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (r: ServiceRecord) => {
    if (typeof window !== "undefined" && !window.confirm(`¿Eliminar el registro de "${r.serviceName}"?`)) return;
    try {
      await deleteRecord(r.id);
      await loadRecords(date);
    } catch {
      setError("No se pudo eliminar el registro.");
    }
  };

  if (checking) {
    return (
      <main className="gradient-hero flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[rgb(10,10,10)]">
      {/* Barra superior */}
      <header className="sticky top-0 z-40 border-b border-yellow-900/30 bg-black/90 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <button
            onClick={() => router.push("/admin")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-400 transition-colors hover:text-yellow-400"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al panel
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-yellow-400">
            <ClipboardList className="h-4 w-4" /> Registro diario
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="text-2xl font-bold gradient-wave">Registro de servicios del día</h1>
        <p className="mt-2 text-sm text-stone-400">
          Anotá cada servicio realizado. Esta información alimentará los reportes.
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="glass-premium mt-8 rounded-[2rem] p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Fecha */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-400">
                Fecha
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-600/70" />
                <input
                  type="date"
                  value={date}
                  max={todayStr()}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-2xl border border-yellow-800/40 bg-black/60 py-3 pl-12 pr-4 text-sm text-stone-100 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/30 [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Cantidad */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-400">
                Cantidad
              </label>
              <input
                type="number"
                min={1}
                step={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-2xl border border-yellow-800/40 bg-black/60 px-4 py-3 text-sm text-stone-100 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/30"
              />
            </div>

            {/* Servicio */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-400">
                Servicio
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full rounded-2xl border border-yellow-800/40 bg-black/60 px-4 py-3 text-sm text-stone-100 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/30 [color-scheme:dark]"
              >
                <option value="">— Seleccioná un servicio —</option>
                {serviceGroups.map((g) => (
                  <optgroup key={g.category} label={g.category}>
                    {g.items.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                        {s.price > 0 ? ` — ₡${s.price.toLocaleString("es-CR")}` : ""}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {services.length === 0 && (
                <p className="mt-2 text-xs text-stone-500">
                  No hay servicios activos. Cargalos primero en el módulo de Servicios.
                </p>
              )}
            </div>

            {/* Nota */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-400">
                Nota (opcional)
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ej. cliente frecuente, promoción, etc."
                className="w-full rounded-2xl border border-yellow-800/40 bg-black/60 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/30"
              />
            </div>
          </div>

          {msg && (
            <div className="mt-4 rounded-2xl border border-yellow-700/40 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-200">
              {msg}
            </div>
          )}

          <button type="submit" disabled={saving} className="btn btn-primary mt-6 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Registrar servicio
          </button>
        </form>

        {/* Resumen del día */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[2rem] border border-yellow-800/30 bg-black/50 p-6">
            <div className="text-xs uppercase tracking-wide text-stone-500">Servicios del día</div>
            <div className="mt-1 text-3xl font-bold text-yellow-400">{dayTotals.count}</div>
          </div>
          <div className="rounded-[2rem] border border-yellow-800/30 bg-black/50 p-6">
            <div className="text-xs uppercase tracking-wide text-stone-500">Total del día</div>
            <div className="mt-1 text-3xl font-bold text-yellow-400">
              ₡{dayTotals.revenue.toLocaleString("es-CR")}
            </div>
          </div>
        </div>

        {/* Lista de registros del día */}
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-stone-200">Registros del {date}</h2>

          {error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
              {error}
            </div>
          ) : loading ? (
            <div className="flex items-center gap-2 py-10 text-stone-500">
              <Loader2 className="h-5 w-5 animate-spin" /> Cargando…
            </div>
          ) : records.length === 0 ? (
            <div className="rounded-2xl border border-yellow-800/30 bg-black/40 px-5 py-8 text-center text-sm text-stone-500">
              No hay registros para este día todavía.
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((r) => (
                <div
                  key={r.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-yellow-800/30 bg-black/50 p-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-stone-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-stone-500">
                        {r.category}
                      </span>
                      <span className="text-sm font-bold text-stone-100">{r.serviceName}</span>
                      {r.quantity > 1 && (
                        <span className="text-xs font-semibold text-stone-400">x{r.quantity}</span>
                      )}
                      {r.price > 0 && (
                        <span className="rounded-full bg-yellow-900/30 px-2.5 py-0.5 text-xs font-semibold text-yellow-400">
                          ₡{(r.price * r.quantity).toLocaleString("es-CR")}
                        </span>
                      )}
                    </div>
                    {r.note && <div className="mt-1 text-xs text-stone-400">{r.note}</div>}
                  </div>
                  <button
                    onClick={() => handleDelete(r)}
                    className="rounded-xl border border-red-800/40 p-2 text-red-400 transition-colors hover:bg-red-900/20"
                    aria-label="Eliminar registro"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
