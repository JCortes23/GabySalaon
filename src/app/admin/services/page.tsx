"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  fetchServices,
  groupByCategory,
  addService,
  updateService,
  archiveService,
  restoreService,
  seedDefaultServices,
  CATEGORY_ORDER,
  type Service,
} from "@/lib/services";
import {
  Loader2,
  Plus,
  Pencil,
  Archive,
  ArchiveRestore,
  Save,
  X,
  ArrowLeft,
  DownloadCloud,
  Scissors,
} from "lucide-react";

const EMPTY = { category: "", name: "", desc: "", price: "" };

export default function AdminServicesPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  // Guardia de sesión.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.replace("/admin/login");
      else setChecking(false);
    });
    return () => unsub();
  }, [router]);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const list = await fetchServices();
      setServices(list);
    } catch {
      setLoadError("No se pudieron cargar los servicios. Revisá que Firestore esté creado.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!checking) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checking]);

  const activeServices = services.filter((s) => s.active !== false);
  const archivedServices = services.filter((s) => s.active === false);
  const groups = groupByCategory(activeServices);

  // Lista de categorías para las sugerencias del formulario.
  const knownCategories: string[] = [...CATEGORY_ORDER];
  for (const s of services) {
    if (!knownCategories.includes(s.category)) knownCategories.push(s.category);
  }

  const resetForm = () => {
    setForm(EMPTY);
    setEditingId(null);
  };

  const startEdit = (s: Service) => {
    setEditingId(s.id);
    setForm({ category: s.category, name: s.name, desc: s.desc, price: String(s.price) });
    setMsg(null);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const price = Number(form.price);
    if (!form.category.trim() || !form.name.trim()) {
      setMsg("La categoría y el título son obligatorios.");
      return;
    }
    if (Number.isNaN(price) || price < 0) {
      setMsg("El precio debe ser un número válido.");
      return;
    }
    setSaving(true);
    try {
      const data = {
        category: form.category.trim(),
        name: form.name.trim(),
        desc: form.desc.trim(),
        price,
      };
      if (editingId) {
        await updateService(editingId, data);
      } else {
        const order = services.filter((s) => s.category === data.category).length;
        await addService({ ...data, order });
      }
      resetForm();
      await load();
    } catch {
      setMsg("No se pudo guardar. Revisá permisos de Firestore y tu conexión.");
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (s: Service) => {
    if (typeof window !== "undefined" && !window.confirm(`¿Archivar "${s.name}"? Dejará de mostrarse en el sitio, pero se conserva para reportes.`)) return;
    try {
      await archiveService(s.id);
      if (editingId === s.id) resetForm();
      await load();
    } catch {
      setMsg("No se pudo archivar. Revisá permisos de Firestore.");
    }
  };

  const handleRestore = async (s: Service) => {
    try {
      await restoreService(s.id);
      await load();
    } catch {
      setMsg("No se pudo restaurar. Revisá permisos de Firestore.");
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    setMsg(null);
    try {
      const n = await seedDefaultServices();
      setMsg(n > 0 ? `Se importaron ${n} servicios.` : "Ya había servicios cargados.");
      await load();
    } catch {
      setMsg("No se pudo importar. Revisá permisos de Firestore.");
    } finally {
      setSeeding(false);
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
            <Scissors className="h-4 w-4" /> Servicios
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="text-2xl font-bold gradient-wave">Gestión de servicios</h1>
        <p className="mt-2 text-sm text-stone-400">
          Creá, editá o eliminá servicios. Los cambios se reflejan en el sitio público.
        </p>

        {/* Formulario alta/edición */}
        <form onSubmit={handleSubmit} className="glass-premium mt-8 rounded-[2rem] p-6 md:p-8">
          <div className="mb-5 flex items-center gap-2 text-sm font-bold text-yellow-400">
            {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Editar servicio" : "Nuevo servicio"}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-400">
                Categoría
              </label>
              <input
                list="categorias"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Cabello, Uñas, Spa & Estética…"
                className="w-full rounded-2xl border border-yellow-800/40 bg-black/60 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/30"
              />
              <datalist id="categorias">
                {knownCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-400">
                Precio (₡) — desde
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0"
                className="w-full rounded-2xl border border-yellow-800/40 bg-black/60 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-400">
                Título
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Corte & Peinado"
                className="w-full rounded-2xl border border-yellow-800/40 bg-black/60 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-400">
                Descripción
              </label>
              <textarea
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                rows={2}
                placeholder="Estilos modernos y clásicos con asesoría personalizada."
                className="w-full resize-none rounded-2xl border border-yellow-800/40 bg-black/60 px-4 py-3 text-sm text-stone-100 placeholder-stone-600 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/30"
              />
            </div>
          </div>

          {msg && (
            <div className="mt-4 rounded-2xl border border-yellow-700/40 bg-yellow-900/20 px-4 py-3 text-sm text-yellow-200">
              {msg}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Guardar cambios" : "Agregar servicio"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary"
              >
                <X className="h-4 w-4" /> Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Lista */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-200">Servicios actuales</h2>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="inline-flex items-center gap-2 rounded-2xl border border-yellow-800/40 bg-black/60 px-4 py-2.5 text-xs font-semibold text-yellow-400 transition-colors hover:border-yellow-500 hover:bg-yellow-900/20 disabled:opacity-60"
              title="Importa los servicios del sitio si la lista está vacía"
            >
              {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <DownloadCloud className="h-4 w-4" />}
              Importar servicios actuales
            </button>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 py-10 text-stone-500">
              <Loader2 className="h-5 w-5 animate-spin" /> Cargando…
            </div>
          ) : loadError ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
              {loadError}
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-2xl border border-yellow-800/30 bg-black/40 px-5 py-8 text-center text-sm text-stone-500">
              Todavía no hay servicios. Usá “Importar servicios actuales” o agregá uno nuevo arriba.
            </div>
          ) : (
            <div className="space-y-8">
              {activeServices.length === 0 ? (
                <div className="rounded-2xl border border-yellow-800/30 bg-black/40 px-5 py-6 text-center text-sm text-stone-500">
                  No hay servicios activos. Restaurá alguno de los archivados o agregá uno nuevo.
                </div>
              ) : (
                groups.map((g) => (
                  <div key={g.category}>
                    <div className="mb-3 text-sm font-bold uppercase tracking-wide text-yellow-500">
                      {g.category}
                    </div>
                    <div className="space-y-3">
                      {g.items.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-start justify-between gap-4 rounded-2xl border border-yellow-800/30 bg-black/50 p-4"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-stone-100">{s.name}</span>
                              {s.price > 0 && (
                                <span className="rounded-full bg-yellow-900/30 px-2.5 py-0.5 text-xs font-semibold text-yellow-400">
                                  ₡{s.price.toLocaleString("es-CR")}
                                </span>
                              )}
                            </div>
                            {s.desc && <div className="mt-1 text-xs text-stone-400">{s.desc}</div>}
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <button
                              onClick={() => startEdit(s)}
                              className="rounded-xl border border-yellow-800/40 p-2 text-yellow-400 transition-colors hover:bg-yellow-900/20"
                              aria-label="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleArchive(s)}
                              className="rounded-xl border border-red-800/40 p-2 text-red-400 transition-colors hover:bg-red-900/20"
                              aria-label="Archivar"
                              title="Archivar (no se elimina)"
                            >
                              <Archive className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}

              {/* Archivados */}
              {archivedServices.length > 0 && (
                <div className="border-t border-yellow-900/30 pt-6">
                  <button
                    onClick={() => setShowArchived((v) => !v)}
                    className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-stone-400 transition-colors hover:text-yellow-400"
                  >
                    <Archive className="h-4 w-4" />
                    {showArchived ? "Ocultar" : "Ver"} archivados ({archivedServices.length})
                  </button>

                  {showArchived && (
                    <div className="space-y-3">
                      {archivedServices.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-start justify-between gap-4 rounded-2xl border border-stone-800/60 bg-black/30 p-4 opacity-70"
                        >
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full border border-stone-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-stone-500">
                                {s.category}
                              </span>
                              <span className="text-sm font-bold text-stone-300 line-through">{s.name}</span>
                              {s.price > 0 && (
                                <span className="text-xs text-stone-500">₡{s.price.toLocaleString("es-CR")}</span>
                              )}
                            </div>
                            {s.desc && <div className="mt-1 text-xs text-stone-600">{s.desc}</div>}
                          </div>
                          <button
                            onClick={() => handleRestore(s)}
                            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-green-800/50 px-3 py-2 text-xs font-semibold text-green-400 transition-colors hover:bg-green-900/20"
                            title="Restaurar"
                          >
                            <ArchiveRestore className="h-4 w-4" /> Restaurar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
