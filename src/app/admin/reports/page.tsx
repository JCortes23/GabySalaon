"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { fetchRecordsBetween, todayStr, type ServiceRecord } from "@/lib/records";
import {
  Loader2,
  ArrowLeft,
  BarChart3,
  Coins,
  ClipboardCheck,
  Receipt,
  CalendarDays,
  Download,
} from "lucide-react";

// ---- Helpers de fecha (YYYY-MM-DD, hora local) ----
function fmt(d: Date): string {
  return d.toLocaleDateString("en-CA");
}
function addDays(base: string, days: number): string {
  const d = new Date(base + "T00:00:00");
  d.setDate(d.getDate() + days);
  return fmt(d);
}
function startOfMonth(base: string): string {
  const d = new Date(base + "T00:00:00");
  return fmt(new Date(d.getFullYear(), d.getMonth(), 1));
}
function prevMonthRange(base: string): { from: string; to: string } {
  const d = new Date(base + "T00:00:00");
  const from = new Date(d.getFullYear(), d.getMonth() - 1, 1);
  const to = new Date(d.getFullYear(), d.getMonth(), 0); // día 0 = último del mes anterior
  return { from: fmt(from), to: fmt(to) };
}
const colones = (n: number) => `₡${Math.round(n).toLocaleString("es-CR")}`;

type Preset = "hoy" | "7dias" | "mes" | "mesAnterior" | "personalizado";

export default function AdminReportsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const today = todayStr();
  const [preset, setPreset] = useState<Preset>("mes");
  const [from, setFrom] = useState<string>(startOfMonth(today));
  const [to, setTo] = useState<string>(today);

  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Guardia de sesión.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.replace("/admin/login");
      else setChecking(false);
    });
    return () => unsub();
  }, [router]);

  const applyPreset = (p: Preset) => {
    setPreset(p);
    if (p === "hoy") {
      setFrom(today);
      setTo(today);
    } else if (p === "7dias") {
      setFrom(addDays(today, -6));
      setTo(today);
    } else if (p === "mes") {
      setFrom(startOfMonth(today));
      setTo(today);
    } else if (p === "mesAnterior") {
      const r = prevMonthRange(today);
      setFrom(r.from);
      setTo(r.to);
    }
    // "personalizado" no cambia las fechas; el usuario las edita.
  };

  const load = async (f: string, t: string) => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchRecordsBetween(f, t);
      setRecords(list);
    } catch {
      setError("No se pudieron cargar los reportes. Revisá que Firestore esté creado.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!checking && from && to && from <= to) load(from, to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking, from, to]);

  // ---- Cálculos ----
  const stats = useMemo(() => {
    const totalRevenue = records.reduce((s, r) => s + r.price * r.quantity, 0);
    const totalCount = records.reduce((s, r) => s + r.quantity, 0);
    const days = new Set(records.map((r) => r.date));
    const avgTicket = totalCount > 0 ? totalRevenue / totalCount : 0;

    const catMap = new Map<string, { count: number; revenue: number }>();
    const svcMap = new Map<string, { name: string; category: string; count: number; revenue: number }>();
    const dayMap = new Map<string, number>();

    for (const r of records) {
      const rev = r.price * r.quantity;

      const c = catMap.get(r.category) ?? { count: 0, revenue: 0 };
      c.count += r.quantity;
      c.revenue += rev;
      catMap.set(r.category, c);

      const key = `${r.category}||${r.serviceName}`;
      const sv = svcMap.get(key) ?? { name: r.serviceName, category: r.category, count: 0, revenue: 0 };
      sv.count += r.quantity;
      sv.revenue += rev;
      svcMap.set(key, sv);

      dayMap.set(r.date, (dayMap.get(r.date) ?? 0) + rev);
    }

    const byCategory = Array.from(catMap.entries())
      .map(([category, v]) => ({ category, ...v }))
      .sort((a, b) => b.revenue - a.revenue);

    const byService = Array.from(svcMap.values()).sort((a, b) => b.revenue - a.revenue);

    const byDay = Array.from(dayMap.entries())
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { totalRevenue, totalCount, activeDays: days.size, avgTicket, byCategory, byService, byDay };
  }, [records]);

  const maxDayRevenue = useMemo(
    () => stats.byDay.reduce((m, d) => Math.max(m, d.revenue), 0),
    [stats.byDay],
  );

  const exportCSV = () => {
    const headers = ["Fecha", "Categoria", "Servicio", "Cantidad", "PrecioUnitario", "Total", "Nota"];
    const rows = [...records]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((r) => [
        r.date,
        r.category,
        r.serviceName,
        String(r.quantity),
        String(r.price),
        String(r.price * r.quantity),
        (r.note ?? "").replace(/"/g, '""'),
      ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_${from}_a_${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (checking) {
    return (
      <main className="gradient-hero flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </main>
    );
  }

  const presets: { key: Preset; label: string }[] = [
    { key: "hoy", label: "Hoy" },
    { key: "7dias", label: "Últimos 7 días" },
    { key: "mes", label: "Este mes" },
    { key: "mesAnterior", label: "Mes anterior" },
    { key: "personalizado", label: "Personalizado" },
  ];

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
            <BarChart3 className="h-4 w-4" /> Reportes
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold gradient-wave">Reportes</h1>
            <p className="mt-2 text-sm text-stone-400">Resumen de los servicios realizados.</p>
          </div>
          <button
            onClick={exportCSV}
            disabled={records.length === 0}
            className="inline-flex items-center gap-2 rounded-2xl border border-yellow-800/40 bg-black/60 px-4 py-2.5 text-sm font-semibold text-yellow-400 transition-colors hover:border-yellow-500 hover:bg-yellow-900/20 disabled:opacity-40"
          >
            <Download className="h-4 w-4" /> Exportar CSV
          </button>
        </div>

        {/* Selector de rango */}
        <div className="glass-premium mt-6 rounded-[2rem] p-5">
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.key}
                onClick={() => applyPreset(p.key)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  preset === p.key
                    ? "bg-gradient-to-r from-yellow-600 to-yellow-400 text-black"
                    : "border border-yellow-800/40 text-stone-400 hover:text-yellow-400"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {preset === "personalizado" && (
            <div className="mt-4 flex flex-wrap items-end gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-400">Desde</label>
                <input
                  type="date"
                  value={from}
                  max={to}
                  onChange={(e) => setFrom(e.target.value)}
                  className="rounded-2xl border border-yellow-800/40 bg-black/60 px-4 py-2.5 text-sm text-stone-100 outline-none focus:border-yellow-500 [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-400">Hasta</label>
                <input
                  type="date"
                  value={to}
                  min={from}
                  max={today}
                  onChange={(e) => setTo(e.target.value)}
                  className="rounded-2xl border border-yellow-800/40 bg-black/60 px-4 py-2.5 text-sm text-stone-100 outline-none focus:border-yellow-500 [color-scheme:dark]"
                />
              </div>
            </div>
          )}
          <div className="mt-3 text-xs text-stone-500">
            Rango: <span className="text-stone-300">{from}</span> a <span className="text-stone-300">{to}</span>
          </div>
        </div>

        {error ? (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        ) : loading ? (
          <div className="mt-10 flex items-center gap-2 text-stone-500">
            <Loader2 className="h-5 w-5 animate-spin" /> Cargando…
          </div>
        ) : records.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-yellow-800/30 bg-black/40 px-5 py-10 text-center text-sm text-stone-500">
            No hay registros en este rango de fechas.
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KPI icon={Coins} label="Ingresos totales" value={colones(stats.totalRevenue)} />
              <KPI icon={ClipboardCheck} label="Servicios realizados" value={String(stats.totalCount)} />
              <KPI icon={Receipt} label="Ticket promedio" value={colones(stats.avgTicket)} />
              <KPI icon={CalendarDays} label="Días con actividad" value={String(stats.activeDays)} />
            </div>

            {/* Ingresos por día */}
            <Card title="Ingresos por día">
              <div className="flex items-end gap-2 overflow-x-auto pb-2" style={{ minHeight: 160 }}>
                {stats.byDay.map((d) => {
                  const h = maxDayRevenue > 0 ? Math.round((d.revenue / maxDayRevenue) * 120) : 0;
                  return (
                    <div key={d.date} className="flex shrink-0 flex-col items-center gap-2" style={{ width: 44 }}>
                      <div className="text-[10px] font-semibold text-stone-400">
                        {Math.round(d.revenue / 1000)}k
                      </div>
                      <div
                        className="w-6 rounded-t-md bg-gradient-to-t from-yellow-700 to-yellow-400"
                        style={{ height: Math.max(h, 4) }}
                        title={`${d.date}: ${colones(d.revenue)}`}
                      />
                      <div className="text-[10px] text-stone-600">{d.date.slice(5)}</div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Ingresos por categoría */}
            <Card title="Ingresos por categoría">
              <div className="space-y-4">
                {stats.byCategory.map((c) => {
                  const pct = stats.totalRevenue > 0 ? (c.revenue / stats.totalRevenue) * 100 : 0;
                  return (
                    <div key={c.category}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-semibold text-stone-200">{c.category}</span>
                        <span className="text-stone-400">
                          {colones(c.revenue)} · {c.count} serv. · {pct.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/60">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Ranking de servicios */}
            <Card title="Servicios más realizados">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-yellow-900/30 text-xs uppercase tracking-wide text-stone-500">
                      <th className="py-2 pr-3">Servicio</th>
                      <th className="py-2 pr-3">Categoría</th>
                      <th className="py-2 pr-3 text-right">Cantidad</th>
                      <th className="py-2 text-right">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.byService.map((s) => (
                      <tr key={`${s.category}-${s.name}`} className="border-b border-white/5">
                        <td className="py-2.5 pr-3 font-semibold text-stone-200">{s.name}</td>
                        <td className="py-2.5 pr-3 text-stone-500">{s.category}</td>
                        <td className="py-2.5 pr-3 text-right text-stone-300">{s.count}</td>
                        <td className="py-2.5 text-right font-semibold text-yellow-400">{colones(s.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}

function KPI({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[2rem] border border-yellow-800/30 bg-black/50 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-stone-500">
        <Icon className="h-4 w-4 text-yellow-600" />
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-yellow-400">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-premium mt-6 rounded-[2rem] p-6 md:p-8">
      <h2 className="mb-5 text-lg font-bold text-stone-200">{title}</h2>
      {children}
    </div>
  );
}
