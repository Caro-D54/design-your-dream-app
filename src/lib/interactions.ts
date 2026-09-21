import type { Medication, Severity } from "./schedule";

type Rule = {
  id: string;
  a: string;
  b?: string;
  severity: Severity;
  title: string;
  body: string;
};

// Reglas basadas en interacciones documentadas en prospecto.
const rules: Rule[] = [
  {
    id: "levo-omeprazol",
    a: "levotiroxina",
    b: "omeprazol",
    severity: "warn",
    title: "Absorción reducida",
    body: "El omeprazol reduce la absorción de la levotiroxina. Tomá la levotiroxina en ayunas y separá al menos 4 horas del omeprazol.",
  },
  {
    id: "levo-calcio",
    a: "levotiroxina",
    severity: "warn",
    title: "Levotiroxina en ayunas",
    body: "Café, leche, calcio y hierro bajan su absorción hasta un 30%. Esperá 30 a 60 minutos antes del desayuno.",
  },
  {
    id: "sim-amox",
    a: "simvastatina",
    b: "amoxicilina",
    severity: "warn",
    title: "Espaciá las tomas",
    body: "Con antibióticos conviene separar la simvastatina al menos 2 horas y estar atenta a dolores musculares.",
  },
  {
    id: "ibu-enalapril",
    a: "ibuprofeno",
    b: "enalapril",
    severity: "alert",
    title: "Interacción: precaución",
    body: "El ibuprofeno reduce el efecto del enalapril y puede afectar el riñón. Consultá antes de combinarlos varios días.",
  },
  {
    id: "ibu-losartan",
    a: "ibuprofeno",
    b: "losartán",
    severity: "alert",
    title: "Interacción: precaución",
    body: "El ibuprofeno sube la presión y baja el efecto del losartán. Usalo solo lo necesario y controlá la presión.",
  },
  {
    id: "sim-pomelo",
    a: "simvastatina",
    severity: "warn",
    title: "Evitá el pomelo",
    body: "El jugo de pomelo multiplica la concentración de simvastatina en sangre. Suspendelo durante el tratamiento.",
  },
  {
    id: "met-ok",
    a: "metformina",
    severity: "safe",
    title: "Metformina compatible",
    body: "No presenta interacciones con el resto de tu plan. Evitá el alcohol en exceso y tomala con las comidas.",
  },
];

const has = (meds: Medication[], term: string) =>
  meds.some((m) => m.name.toLowerCase().includes(term));

export function checkInteractions(meds: Medication[]) {
  const active = meds.filter((m) => m.active);
  const found = rules.filter((r) => has(active, r.a) && (!r.b || has(active, r.b)));
  const order: Record<Severity, number> = { alert: 0, warn: 1, safe: 2 };
  return found.sort((x, y) => order[x.severity] - order[y.severity]);
}
