"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { site } from "@/content/site";
import { LogOut, Loader2, LayoutDashboard, Scissors, ChevronRight, ClipboardList, BarChart3, CalendarCheck } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  // Guardia de ruta: sin sesión -> al login.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/admin/login");
      } else {
        setUser(u);
        setChecking(false);
      }
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/admin/login");
  };

  // Mientras verifica la sesión, mostramos un loader (evita parpadeo del panel).
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
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg"
              style={{ background: "linear-gradient(135deg, rgb(201, 168, 76), rgb(160, 128, 40))" }}
            >
              <LayoutDashboard className="h-5 w-5 text-black" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Panel de administración
              </div>
              <div className="text-xs text-stone-500">{site.name}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl border border-yellow-800/40 bg-black/60 px-4 py-2.5 text-sm font-semibold text-yellow-400 transition-colors hover:border-yellow-500 hover:bg-yellow-900/20"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Contenido */}
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="glass-premium rounded-[2rem] p-8 text-center">
          <h1 className="text-2xl font-bold gradient-wave">Bienvenid@ al panel</h1>
          <p className="mt-3 text-sm text-stone-400">
            Sesión iniciada como <span className="text-yellow-400">{user?.email}</span>
          </p>
        </div>

        {/* Módulos */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => router.push("/admin/services")}
            className="group flex items-center gap-4 rounded-[2rem] border-2 border-white/10 bg-black/60 p-6 text-left transition-all duration-300 hover:border-yellow-700/50 hover:bg-black/80"
          >
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-lg"
              style={{ background: "linear-gradient(135deg, rgb(201, 168, 76), rgb(160, 128, 40))" }}
            >
              <Scissors className="h-7 w-7 text-black" />
            </div>
            <div className="flex-1">
              <div className="text-base font-bold text-stone-100">Servicios</div>
              <div className="mt-0.5 text-xs text-stone-500">Crear, editar y archivar servicios</div>
            </div>
            <ChevronRight className="h-5 w-5 text-stone-600 transition-colors group-hover:text-yellow-400" />
          </button>

          <button
            onClick={() => router.push("/admin/reservations")}
            className="group flex items-center gap-4 rounded-[2rem] border-2 border-white/10 bg-black/60 p-6 text-left transition-all duration-300 hover:border-yellow-700/50 hover:bg-black/80"
          >
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-lg"
              style={{ background: "linear-gradient(135deg, rgb(201, 168, 76), rgb(160, 128, 40))" }}
            >
              <CalendarCheck className="h-7 w-7 text-black" />
            </div>
            <div className="flex-1">
              <div className="text-base font-bold text-stone-100">Reservas</div>
              <div className="mt-0.5 text-xs text-stone-500">Gestionar citas de las clientas</div>
            </div>
            <ChevronRight className="h-5 w-5 text-stone-600 transition-colors group-hover:text-yellow-400" />
          </button>

          <button
            onClick={() => router.push("/admin/records")}
            className="group flex items-center gap-4 rounded-[2rem] border-2 border-white/10 bg-black/60 p-6 text-left transition-all duration-300 hover:border-yellow-700/50 hover:bg-black/80"
          >
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-lg"
              style={{ background: "linear-gradient(135deg, rgb(201, 168, 76), rgb(160, 128, 40))" }}
            >
              <ClipboardList className="h-7 w-7 text-black" />
            </div>
            <div className="flex-1">
              <div className="text-base font-bold text-stone-100">Registro diario</div>
              <div className="mt-0.5 text-xs text-stone-500">Anotar servicios realizados por día</div>
            </div>
            <ChevronRight className="h-5 w-5 text-stone-600 transition-colors group-hover:text-yellow-400" />
          </button>

          <button
            onClick={() => router.push("/admin/reports")}
            className="group flex items-center gap-4 rounded-[2rem] border-2 border-white/10 bg-black/60 p-6 text-left transition-all duration-300 hover:border-yellow-700/50 hover:bg-black/80"
          >
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-lg"
              style={{ background: "linear-gradient(135deg, rgb(201, 168, 76), rgb(160, 128, 40))" }}
            >
              <BarChart3 className="h-7 w-7 text-black" />
            </div>
            <div className="flex-1">
              <div className="text-base font-bold text-stone-100">Reportes</div>
              <div className="mt-0.5 text-xs text-stone-500">Ingresos y servicios por período</div>
            </div>
            <ChevronRight className="h-5 w-5 text-stone-600 transition-colors group-hover:text-yellow-400" />
          </button>
        </div>
      </div>
    </main>
  );
}
