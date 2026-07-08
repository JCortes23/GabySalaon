// Capa de datos de "registros" — bitácora de servicios realizados en el salón.
// Colección: "records" — cada documento guarda una copia (snapshot) del servicio
// (nombre, categoría, precio) para que los reportes no dependan de cambios futuros.
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ServiceRecord = {
  id: string;
  date: string; // YYYY-MM-DD (día en que se realizó)
  serviceId: string;
  serviceName: string;
  category: string;
  price: number; // precio unitario al momento del registro
  quantity: number;
  note?: string;
};

export type ServiceRecordInput = Omit<ServiceRecord, "id">;

const COL = "records";

// Devuelve la fecha de hoy como YYYY-MM-DD (hora local).
export function todayStr(): string {
  return new Date().toLocaleDateString("en-CA"); // en-CA => YYYY-MM-DD
}

export async function addRecord(data: ServiceRecordInput) {
  return addDoc(collection(db, COL), data);
}

export async function fetchRecordsByDate(date: string): Promise<ServiceRecord[]> {
  const snap = await getDocs(query(collection(db, COL), where("date", "==", date)));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as ServiceRecordInput) }));
}

export async function fetchAllRecords(): Promise<ServiceRecord[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as ServiceRecordInput) }));
}

// Trae registros entre dos fechas (inclusive), formato YYYY-MM-DD.
// El orden lexicográfico de las fechas ISO permite el rango en un solo campo.
export async function fetchRecordsBetween(from: string, to: string): Promise<ServiceRecord[]> {
  const snap = await getDocs(
    query(collection(db, COL), where("date", ">=", from), where("date", "<=", to)),
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as ServiceRecordInput) }));
}

export async function deleteRecord(id: string) {
  return deleteDoc(doc(db, COL, id));
}
