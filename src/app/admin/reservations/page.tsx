"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { todayStr } from "@/lib/records";
import {
  fetchReservationsByDate,
  setReservationStatus,
  type Reservation,
  type ReservationStatus,
} from "@/lib/booking";
import {
  Loader2,
  ArrowLeft,
  CalendarCheck,
  Check,
  X,
  Clock,
  Phone,
  RotateCcw,
  CircleCheck,
} from "lucide-react";

const STATUS_STYLE: Record<ReservationStatus, string> = {
  pendiente: "border-yellow-600/50 bg-yellow-900/20 text-yellow-300",
  confirmada: "border-blue-600/50 bg-blue-900/20 text-blue-300",
  completada: "border-green-600/50 bg-green-900/20 text-green-300",
  cancelada: "border-stone-600/50 bg-stone-800/30 text-stone-400",
};

export default function AdminReservationsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const [date, setDate] = useState(todayStr());
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.replace("/admin/login");
      else setChecking(false);
    });
    return () => unsub();
  }, [router]);

  const load = async (d: string) => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchReservationsByDate(d);
      list.sort((a, b) => a.time.localeCompare(b.time));
      setItems(list);
    } catch {
      setError("No se pudieron cargar las reservas. Revisá que Firestore esté creado.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!checking) load(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking, date]);

  const changeStatus = async (r: Reservation, status: ReservationStatus) => {
    setBusyId(r.id);
    try {
      await setReservationStatus(r.id, status);
      await load(date);
    } catch {
      setError("No se pudo actualizar la reserva.");
    } finally {
      setBusyId(null);
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
      <header className="sticky top-0 z-40 border-b border-yellow-900/30 bg-black/90 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <button
            onClick={() => router.push("/admin")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-400 transition-colors hover:text-yellow-400"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al panel
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-yellow-400">
            <CalendarCheck className="h-4 w-4" /> Reservas
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold gradient-wave">Reservas</h1>
            <p className="mt-2 text-sm text-stone-400">Gestioná las citas del día.</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-400">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-2xl border border-yellow-800/40 bg-black/60 px-4 py-2.5 text-sm text-stone-100 outline-none focus:border-yellow-500 [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="mt-8">
          {error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
              {error}
            </div>
          ) : loading ? (
            <div className="flex items-center gap-2 py-10 text-stone-500">
              <Loader2 className="h-5 w-5 animate-spin" /> Cargando…
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-yellow-800/30 bg-black/40 px-5 py-10 text-center text-sm text-stone-500">
              No hay reservas para este día.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((r) => (
                <div
                  key={r.id}
                  className={`rounded-2xl border bg-black/50 p-4 ${
                    r.status === "cancelada" ? "border-stone-800/60 opacity-70" : "border-yellow-800/30"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-yellow-400">
                          <Clock className="h-3.5 w-3.5" /> {r.time}
                        </span>
                        <span className="text-sm font-bold text-stone-100">{r.serviceName}</span>
                        <span className="rounded-full border border-stone-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-stone-500">
                          {r.category}
                        </span>
                        {r.price > 0 && (
                          <span className="rounded-full bg-yellow-900/30 px-2.5 py-0.5 text-xs font-semibold text-yellow-400">
                            ₡{r.price.toLocaleString("es-CR")}
                          </span>
                        )}
                        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLE[r.status]}`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400">
                        <span className="font-semibold text-stone-300">{r.customerName}</span>
                        <a
                          href={`https://wa.me/${r.customerPhone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-stone-400 transition-colors hover:text-yellow-400"
                        >
                          <Phone className="h-3 w-3" /> {r.customerPhone}
                        </a>
                      </div>
                      {r.note && <div className="mt-1 text-xs text-stone-500">“{r.note}”</div>}
                    </div>

                    {/* Acciones */}
                    <div className="flex shrink-0 flex-wrap gap-2">
                      {busyId === r.id ? (
                        <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
                      ) : r.status === "cancelada" ? (
                        <ActionBtn onClick={() => changeStatus(r, "pendiente")} tone="neutral" icon={RotateCcw} label="Reactivar" />
                      ) : (
                        <>
                          {r.status === "pendiente" && (
                            <ActionBtn onClick={() => changeStatus(r, "confirmada")} tone="blue" icon={Check} label="Confirmar" />
                          )}
                          {r.status !== "completada" && (
                            <ActionBtn onClick={() => changeStatus(r, "completada")} tone="green" icon={CircleCheck} label="Completar" />
                          )}
                          <ActionBtn onClick={() => changeStatus(r, "cancelada")} tone="red" icon={X} label="Cancelar" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ActionBtn({
  onClick,
  tone,
  icon: Icon,
  label,
}: {
  onClick: () => void;
  tone: "blue" | "green" | "red" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  const styles = {
    blue: "border-blue-700/50 text-blue-300 hover:bg-blue-900/20",
    green: "border-green-700/50 text-green-300 hover:bg-green-900/20",
    red: "border-red-800/50 text-red-300 hover:bg-red-900/20",
    neutral: "border-yellow-800/40 text-stone-300 hover:bg-yellow-900/20",
  }[tone];
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${styles}`}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
