export type Severity = "safe" | "warn" | "alert";

export type Medication = {
  id: string;
  name: string;
  strength: string | null;
  dose: string;
  times: string[];
  meal: string;
  condition: string | null;
  guide: string[];
  remind_minutes: number;
  notify: boolean;
  active: boolean;
};

export type DoseLog = {
  medication_id: string;
  dose_day: string;
  dose_time: string;
};

export type Slot = {
  key: string;
  med: Medication;
  time: string;
  taken: boolean;
};

export function fullName(med: Pick<Medication, "name" | "strength">) {
  return med.strength ? `${med.name} ${med.strength}` : med.name;
}

export function toMinutes(time: string) {
  const [h = "0", m = "0"] = time.split(":");
  return Number(h) * 60 + Number(m);
}

export function dayKey(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function slotsForDay(meds: Medication[], logs: DoseLog[], day: string): Slot[] {
  const taken = new Set(logs.map((l) => `${l.medication_id}|${l.dose_day}|${l.dose_time}`));
  return meds
    .filter((m) => m.active)
    .flatMap((med) =>
      med.times.map((time) => ({
        key: `${med.id}|${day}|${time}`,
        med,
        time,
        taken: taken.has(`${med.id}|${day}|${time}`),
      })),
    )
    .sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
}

export function nextSlot(slots: Slot[], now: Date) {
  const mins = now.getHours() * 60 + now.getMinutes();
  return slots.find((s) => !s.taken && toMinutes(s.time) >= mins) ?? slots.find((s) => !s.taken);
}

export function relativeLabel(time: string, now: Date) {
  const diff = toMinutes(time) - (now.getHours() * 60 + now.getMinutes());
  if (diff < -60) return `hoy · ${time}`;
  if (diff < 0) return `atrasada · ${time}`;
  if (diff < 60) return `en ${diff} min · ${time}`;
  return `en ${Math.round(diff / 60)} h · ${time}`;
}

export function adherence(slots: Slot[]) {
  if (slots.length === 0) return 0;
  return Math.round((slots.filter((s) => s.taken).length / slots.length) * 100);
}
