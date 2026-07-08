"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { site } from "@/content/site";
import { Lock, Mail, Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si ya hay sesión activa, saltar directo al panel.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/admin");
    });
    return () => unsub();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/admin");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        setError("Usuario o contraseña incorrectos.");
      } else if (code === "auth/invalid-email") {
        setError("El correo no es válido.");
      } else if (code === "auth/too-many-requests") {
        setError("Demasiados intentos. Probá de nuevo en unos minutos.");
      } else {
        setError("No se pudo iniciar sesión. Verificá tu conexión e intentá de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="gradient-hero relative flex min-h-screen items-center justify-center overflow-hidden px-5">
      {/* Blobs decorativos */}
      <div className="absolute top-20 left-[10%] h-32 w-32 animate-pulse rounded-full bg-yellow-600/20 blur-3xl" />
      <div className="absolute bottom-20 right-[12%] h-40 w-40 animate-pulse rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-premium rounded-[2rem] p-8 shadow-2xl">
          {/* Encabezado */}
          <div className="mb-8 text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
              style={{ background: "linear-gradient(135deg, rgb(201, 168, 76), rgb(160, 128, 40))" }}
            >
              <Lock className="h-8 w-8 text-black" />
            </div>
            <h1 className="text-2xl font-bold gradient-wave">Panel de administración</h1>
            <p className="mt-2 text-sm text-stone-400">{site.name}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Correo */}
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-400">
                Correo
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-600/70" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gabysalonyspa.com"
                  className="w-full rounded-2xl border border-yellow-800/40 bg-black/60 py-3.5 pl-12 pr-4 text-sm text-stone-100 placeholder-stone-600 outline-none transition-colors focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/30"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stone-400">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-600/70" />
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-yellow-800/40 bg-black/60 py-3.5 pl-12 pr-12 text-sm text-stone-100 placeholder-stone-600 outline-none transition-colors focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 transition-colors hover:text-yellow-500"
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Botón */}
            <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-60">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ingresando…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Iniciar sesión
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-stone-600">
          Acceso exclusivo para personal autorizado.
        </p>
      </div>
    </main>
  );
}
