import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { DoseLog, Medication } from "./schedule";

export type MedicationInput = {
  id?: string;
  name: string;
  strength: string;
  dose: string;
  times: string[];
  meal: string;
  condition: string;
  guide: string[];
  remind_minutes: number;
  notify: boolean;
  active: boolean;
};

export type Profile = {
  id: string;
  full_name: string | null;
  timezone: string;
  allergies: string | null;
  reminder_minutes: number;
};

export const getPlan = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { day: string }) => ({ day: String(data.day).slice(0, 10) }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const [profileRes, medsRes, logsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase
        .from("medications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true }),
      supabase
        .from("dose_logs")
        .select("medication_id, dose_day, dose_time")
        .gte("dose_day", new Date(Date.now() - 29 * 864e5).toISOString().slice(0, 10)),
    ]);

    if (medsRes.error) throw new Error(medsRes.error.message);

    const logs = (logsRes.data ?? []) as DoseLog[];
    return {
      profile: (profileRes.data ?? null) as Profile | null,
      medications: (medsRes.data ?? []) as Medication[],
      logs: logs.filter((l) => l.dose_day === data.day),
      historyLogs: logs,
    };
  });

export const saveMedication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: MedicationInput) => {
    const name = String(data.name ?? "").trim();
    if (!name) throw new Error("Falta el nombre del medicamento");
    const times = (Array.isArray(data.times) ? data.times : [])
      .map((t) => String(t).slice(0, 5))
      .filter((t) => /^\d{2}:\d{2}$/.test(t));
    if (times.length === 0) throw new Error("Agregá al menos un horario");
    return {
      id: data.id ? String(data.id) : undefined,
      name,
      strength: String(data.strength ?? "").trim(),
      dose: String(data.dose ?? "1 comprimido").trim() || "1 comprimido",
      times,
      meal: String(data.meal ?? "Indistinto"),
      condition: String(data.condition ?? "").trim(),
      guide: (Array.isArray(data.guide) ? data.guide : []).map((g) => String(g)).filter(Boolean),
      remind_minutes: Math.max(0, Math.min(180, Number(data.remind_minutes ?? 10))),
      notify: Boolean(data.notify),
      active: data.active !== false,
    };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const row = { ...data, user_id: userId, id: data.id ?? undefined };
    const { data: saved, error } = await supabase
      .from("medications")
      .upsert(row)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return saved as Medication;
  });

export const deleteMedication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => ({ id: String(data.id) }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("medications").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setDose = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { medicationId: string; day: string; time: string; taken: boolean }) => ({
    medicationId: String(data.medicationId),
    day: String(data.day).slice(0, 10),
    time: String(data.time).slice(0, 5),
    taken: Boolean(data.taken),
  }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (data.taken) {
      const { error } = await supabase.from("dose_logs").upsert(
        {
          user_id: userId,
          medication_id: data.medicationId,
          dose_day: data.day,
          dose_time: data.time,
        },
        { onConflict: "medication_id,dose_day,dose_time" },
      );
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("dose_logs")
        .delete()
        .eq("medication_id", data.medicationId)
        .eq("dose_day", data.day)
        .eq("dose_time", data.time);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { full_name: string; allergies: string; reminder_minutes: number }) => ({
    full_name: String(data.full_name ?? "").trim(),
    allergies: String(data.allergies ?? "").trim(),
    reminder_minutes: Math.max(0, Math.min(180, Number(data.reminder_minutes ?? 10))),
  }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId, ...data, timezone: "America/Argentina/Buenos_Aires" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
