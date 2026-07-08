// Reservas guardadas en Firestore (versión simple, fácil de leer).
// - Colección "reservations": guarda cada cita.
// - Colección "slots": un contador por hora para saber cuántos cupos hay ocupados.
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { site } from "@/content/site";

export type ReservationStatus = "pendiente" | "confirmada" | "completada" | "cancelada";

export type Reservation = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  slotId: string;
  serviceId: string;
  serviceName: string;
  category: string;
  price: number;
  customerName: string;
  customerPhone: string;
  note?: string;
  status: ReservationStatus;
};

export type NewReservation = Omit<Reservation, "id" | "slotId" | "status">;

// Cuántas personas se pueden atender a la misma hora y duración de cada franja.
export const CAPACITY = site.booking.capacityPerSlot;
const SLOT_MIN = site.booking.slotMinutes;
const HOURS = site.booking.hours;

// Pasar "08:00" a minutos (480) y al revés. Sirve para armar las franjas.
function horaAMinutos(hora: string): number {
  const partes = hora.split(":");
  return Number(partes[0]) * 60 + Number(partes[1]);
}
function minutosAHora(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
}

// Devuelve las horas disponibles de un día según el horario del salón.
export function slotsForDate(dateStr: string): string[] {
  if (!dateStr) return [];
  const diaSemana = new Date(dateStr + "T00:00:00").getDay(); // 0 = domingo
  const horario = HOURS[diaSemana];
  if (!horario) return []; // cerrado ese día

  const horas: string[] = [];
  let minuto = horaAMinutos(horario.open);
  const cierre = horaAMinutos(horario.close);
  while (minuto + SLOT_MIN <= cierre) {
    horas.push(minutosAHora(minuto));
    minuto = minuto + SLOT_MIN;
  }
  return horas;
}

// Dice si el salón está cerrado ese día.
export function isClosed(dateStr: string): boolean {
  if (!dateStr) return true;
  const diaSemana = new Date(dateStr + "T00:00:00").getDay();
  return HOURS[diaSemana] == null;
}

// Identificador del contador de una hora concreta, ej: "2026-07-10_14:00".
export function slotId(date: string, time: string): string {
  return date + "_" + time;
}

// Lee cuántos cupos hay ocupados en cada hora de un día. Ej: { "14:00": 2 }
export async function fetchSlotCounts(date: string): Promise<Record<string, number>> {
  const q = query(collection(db, "slots"), where("date", "==", date));
  const resultado = await getDocs(q);
  const conteo: Record<string, number> = {};
  resultado.forEach((d) => {
    const data = d.data();
    conteo[data.time] = data.count;
  });
  return conteo;
}

// Crea una reserva. Si la hora ya está llena, lanza el error "FULL".
export async function createReservation(data: NewReservation): Promise<void> {
  const id = slotId(data.date, data.time);
  const slotRef = doc(db, "slots", id);

  // 1) Revisar cuántos cupos hay ocupados en esa hora.
  const slotSnap = await getDoc(slotRef);
  const ocupados = slotSnap.exists() ? slotSnap.data().count : 0;
  if (ocupados >= CAPACITY) {
    throw new Error("FULL");
  }

  // 2) Guardar la reserva como "pendiente".
  await addDoc(collection(db, "reservations"), {
    ...data,
    slotId: id,
    status: "pendiente",
  });

  // 3) Sumar 1 al contador de esa hora.
  await setDoc(slotRef, { date: data.date, time: data.time, count: ocupados + 1 }, { merge: true });
}

// Trae las reservas de un día (para el panel de admin).
export async function fetchReservationsByDate(date: string): Promise<Reservation[]> {
  const q = query(collection(db, "reservations"), where("date", "==", date));
  const resultado = await getDocs(q);
  return resultado.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Reservation, "id">) }));
}

// Suma o resta 1 al contador de una hora (sin bajar de 0).
async function cambiarContador(slotIdStr: string, cambio: number): Promise<void> {
  const slotRef = doc(db, "slots", slotIdStr);
  const slotSnap = await getDoc(slotRef);
  const actual = slotSnap.exists() ? slotSnap.data().count : 0;
  const nuevo = Math.max(0, actual + cambio);
  await setDoc(slotRef, { count: nuevo }, { merge: true });
}

// Cambia el estado de una reserva. Si se cancela, libera el cupo.
export async function setReservationStatus(id: string, newStatus: ReservationStatus): Promise<void> {
  const resRef = doc(db, "reservations", id);
  const snap = await getDoc(resRef);
  if (!snap.exists()) return;
  const reserva = snap.data() as Omit<Reservation, "id">;

  await updateDoc(resRef, { status: newStatus });

  const estabaActiva = reserva.status !== "cancelada";
  const quedaActiva = newStatus !== "cancelada";
  if (estabaActiva && !quedaActiva) await cambiarContador(reserva.slotId, -1); // se canceló
  if (!estabaActiva && quedaActiva) await cambiarContador(reserva.slotId, +1); // se reactivó
}
