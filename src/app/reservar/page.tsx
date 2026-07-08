"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { fetchActiveServices, groupByCategory, type Service } from "@/lib/services";
import { todayStr } from "@/lib/records";
import {
  slotsForDate,
  isClosed,
  fetchSlotCounts,
  createReservation,
  CAPACITY,
} from "@/lib/booking";
import { ServicePicker } from "@/components/service-picker";
import { Loader2, ArrowLeft, CalendarCheck, Check, Clock, Home } from "lucide-react";

export default function ReservarPage() {
  const today = todayStr();

  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [done, setDone] = useState<null | { service: string; date: string; time: string }>(null);

  useEffect(() => {
    (async () => {
      try {
        setServices(await fetchActiveServices());
      } catch {
        /* si falla, el select queda vacío */
      }
    })();
  }, []);

  // Recargar ocupación al cambiar la fecha.
  const loadCounts = async (d: string) => {
    setTime("");
    if (!d || isClosed(d)) {
      setCounts({});
      return;
    }
    setLoadingSlots(true);
    try {
      setCounts(await fetchSlotCounts(d));
    } catch {
      setCounts({});
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    loadCounts(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const serviceGroups = groupByCategory(services);
  const slots = slotsForDate(date);
  const closed = isClosed(date);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const svc = services.find((s) => s.id === serviceId);
    if (!svc) return setMsg("Seleccioná un servicio.");
    if (!time) return setMsg("Seleccioná una hora disponible.");
    if (!name.trim()) return setMsg("Ingresá tu nombre.");
    if (phone.replace(/\D/g, "").length < 8) return setMsg("Ingresá un número de WhatsApp válido.");

    setSaving(true);
    try {
      await createReservation({
        date,
        time,
        serviceId: svc.id,
        serviceName: svc.name,
        category: svc.category,
        price: svc.price,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        note: note.trim() || "",
      });
      setDone({ service: svc.name, date, time });
    } catch (err) {
      if ((err as Error)?.message === "FULL") {
        setMsg("Esa hora se acaba de ocupar. Elegí otra, por favor.");
        await loadCounts(date);
      } else {
        setMsg("No se pudo registrar la reserva. Intentá de nuevo en un momento.");
      }
    } finally {
      setSaving(false);
    }
  };

  const resetForNew = () => {
    setDone(null);
    setServiceId("");
    setTime("");
    setName("");
    setPhone("");
    setNote("");
    loadCounts(date);
  };

  return (
    <main className="gradient-hero min-h-screen">
      <header className="border-b border-yellow-900/30 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-400 transition-colors hover:text-yellow-400">
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </Link>
          <div className="text-sm font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            {site.name}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
            style={{ background: "linear-gradient(135deg, rgb(201, 168, 76), rgb(160, 128, 40))" }}>
            <CalendarCheck className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold gradient-wave">Reservá tu cita</h1>
          <p className="mt-2 text-sm text-stone-400">Elegí el servicio, el día y la hora. ¡Te esperamos!</p>
        </div>

        {done ? (
          <div className="glass-premium rounded-[2rem] p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15">
              <Check className="h-7 w-7 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-stone-100">¡Reserva enviada!</h2>
            <p className="mt-3 text-sm text-stone-400">
              <span className="text-yellow-400">{done.service}</span>
              <br />
              {done.date} a las <span className="text-yellow-400">{done.time}</span>
            </p>
            <p className="mx-auto mt-4 max-w-sm text-xs text-stone-500">
              Tu reserva quedó como <b>pendiente</b>. El salón la confirmará. Si necesitás cambiarla,
              escribinos por WhatsApp.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button onClick={resetForNew} className="btn btn-secondary">
                Hacer otra reserva
              </button>
              <Link href="/" className="btn btn-primary">
                <Home className="h-4 w-4" />
                Volver al inicio
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-premium rounded-[2rem] p-6 md:p-8">
            {/* Servicio */}
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-400">Servicio</label>
            <div className="mb-5">
              <ServicePicker
                groups={serviceGroups}
                value={serviceId}
                onChange={setServiceId}
                placeholder="— Elegí un servicio —"
              />
            </div>

            {/* Fecha */}
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-400">Fecha</label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="mb-5 w-full rounded-2xl border border-yellow-800/40 bg-black/60 px-4 py-3 text-sm text-stone-100 outline-none focus:border-yellow-500 [color-scheme:dark]"
            />

            {/* Horas */}
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-400">Hora</label>
            {closed ? (
              <div className="mb-5 rounded-2xl border border-yellow-800/30 bg-black/40 px-4 py-4 text-sm text-stone-500">
                El salón está cerrado ese día. Elegí otra fecha.
              </div>
            ) : loadingSlots ? (
              <div className="mb-5 flex items-center gap-2 py-3 text-sm text-stone-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Cargando horas…
              </div>
            ) : (
              <div className="mb-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots.map((t) => {
                  const full = (counts[t] ?? 0) >= CAPACITY;
                  const active = time === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={full}
                      onClick={() => setTime(t)}
                      className={`inline-flex items-center justify-center gap-1 rounded-xl border px-2 py-2.5 text-sm font-semibold transition-colors ${
                        active
                          ? "border-yellow-500 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black"
                          : full
                          ? "cursor-not-allowed border-stone-800 text-stone-700 line-through"
                          : "border-yellow-800/40 text-stone-300 hover:border-yellow-500 hover:text-yellow-400"
                      }`}
                    >
                      <Clock className="h-3 w-3" /> {t}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Datos de la clienta */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-400">Nombre</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full rounded-2xl border border-yellow-800/40 bg-black/60 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-400">WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="8888-8888"
                  className="w-full rounded-2xl border border-yellow-800/40 bg-black/60 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-yellow-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-400">Nota (opcional)</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Algún detalle que quieras contarnos"
                className="w-full rounded-2xl border border-yellow-800/40 bg-black/60 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-yellow-500"
              />
            </div>

            {msg && (
              <div className="mt-4 rounded-2xl border border-yellow-700/40 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-200">
                {msg}
              </div>
            )}

            <button type="submit" disabled={saving} className="btn btn-primary mt-6 w-full disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarCheck className="h-4 w-4" />}
              Reservar cita
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
