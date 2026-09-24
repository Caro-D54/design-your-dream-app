import { useCallback, useEffect, useState } from "react";
import { getPlan, type Profile } from "./meds.functions";
import { dayKey, type DoseLog, type Medication } from "./schedule";

type PlanState = {
  loading: boolean;
  error: string;
  profile: Profile | null;
  medications: Medication[];
  logs: DoseLog[];
  historyLogs: DoseLog[];
};

export function usePlan() {
  const day = dayKey(new Date());
  const [state, setState] = useState<PlanState>({
    loading: true,
    error: "",
    profile: null,
    medications: [],
    logs: [],
    historyLogs: [],
  });

  const reload = useCallback(async () => {
    try {
      const plan = await getPlan({ data: { day } });
      setState({
        loading: false,
        error: "",
        profile: plan.profile,
        medications: plan.medications,
        logs: plan.logs,
        historyLogs: plan.historyLogs,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "No pudimos cargar tu plan",
      }));
    }
  }, [day]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { ...state, day, reload, setState };
}
