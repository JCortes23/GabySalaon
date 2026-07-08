// Capa de datos de "servicios" sobre Firestore.
// Colección: "services" — cada documento: { category, name, desc, price, order }
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { site } from "@/content/site";

export type Service = {
  id: string;
  category: string;
  name: string;
  desc: string;
  price: number;
  order?: number;
  active?: boolean; // borrado lógico: false = archivado (no se muestra, pero se conserva)
};

export type ServiceInput = Omit<Service, "id">;

export type ServiceGroup = { category: string; items: Service[] };

// Orden preferido de categorías (las demás van después, alfabéticas).
export const CATEGORY_ORDER = ["Cabello", "Uñas", "Spa & Estética"];

const COL = "services";

// Trae TODOS los servicios (activos y archivados). Para uso del panel admin.
export async function fetchServices(): Promise<Service[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as ServiceInput) }));
}

// Trae solo los servicios ACTIVOS. Para el sitio público.
export async function fetchActiveServices(): Promise<Service[]> {
  const snap = await getDocs(query(collection(db, COL), where("active", "==", true)));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as ServiceInput) }));
}

// Agrupa los servicios por categoría (forma simple, con arreglos).
export function groupByCategory(services: Service[]): ServiceGroup[] {
  const grupos: ServiceGroup[] = [];

  for (const s of services) {
    // buscar si la categoría ya existe en la lista
    let grupo = grupos.find((g) => g.category === s.category);
    if (!grupo) {
      grupo = { category: s.category, items: [] };
      grupos.push(grupo);
    }
    grupo.items.push(s);
  }

  // ordenar los servicios dentro de cada categoría por su número de orden
  for (const g of grupos) {
    g.items.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  // ordenar las categorías (Cabello, Uñas, Spa & Estética)
  grupos.sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category));

  return grupos;
}

export async function addService(data: ServiceInput) {
  return addDoc(collection(db, COL), { active: true, ...data });
}

export async function updateService(id: string, data: Partial<ServiceInput>) {
  return updateDoc(doc(db, COL, id), data);
}

// Borrado LÓGICO: marca el servicio como archivado (no se elimina de Firestore).
export async function archiveService(id: string) {
  return updateDoc(doc(db, COL, id), { active: false });
}

// Restaura un servicio archivado.
export async function restoreService(id: string) {
  return updateDoc(doc(db, COL, id), { active: true });
}

// Copia los servicios de site.ts a Firestore. Solo corre si no hay nada cargado.
// Devuelve cuántos servicios se crearon (0 si ya había datos).
export async function seedDefaultServices(): Promise<number> {
  const existing = await fetchServices();
  if (existing.length > 0) return 0;

  let order = 0;
  for (const cat of site.services) {
    for (const it of cat.items) {
      await addService({
        category: cat.category,
        name: it.name,
        desc: it.desc,
        price: (it as { price?: number }).price ?? 0,
        order: order,
      });
      order++;
    }
  }
  return order;
}
