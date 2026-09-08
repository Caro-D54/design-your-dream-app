export type Severity = "safe" | "warn" | "alert";

export type Treatment = {
  id: string;
  name: string;
  dose: string;
  schedule: string;
  hour: string;
  severity: Severity;
  taken: boolean;
  meal: string;
  condition: string;
  guide: string[];
};

export const user = { name: "Marina", initials: "ML", today: "Lunes 14 · 08:20" };

export const nextDose = {
  name: "Metformina 500 mg",
  detail: "2 comprimidos · con almuerzo",
  at: "hoy · 12:00",
  pills: 2,
};

export const treatments: Treatment[] = [
  {
    id: "metformina",
    name: "Metformina 500 mg",
    dose: "2 comp",
    schedule: "2 comp · 8:00 y 20:00",
    hour: "08",
    severity: "safe",
    taken: false,
    meal: "Con las comidas",
    condition: "Resistencia a la insulina",
    guide: [
      "Tomar junto al desayuno y la cena para reducir molestias digestivas.",
      "Nunca partir el comprimido de liberación prolongada.",
      "Beber un vaso de agua completo con cada toma.",
    ],
  },
  {
    id: "amoxicilina",
    name: "Amoxicilina 500 mg",
    dose: "1 cáps",
    schedule: "1 cáps · cada 8 h",
    hour: "12",
    severity: "warn",
    taken: false,
    meal: "Indistinto",
    condition: "Infección respiratoria · 7 días",
    guide: [
      "Mantener intervalos exactos de 8 h, incluso de noche.",
      "Completar el tratamiento aunque los síntomas desaparezcan.",
      "Separar 2 h de la Simvastatina.",
    ],
  },
  {
    id: "simvastatina",
    name: "Simvastatina 20 mg",
    dose: "1 comp",
    schedule: "1 comp · 20:00",
    hour: "20",
    severity: "safe",
    taken: true,
    meal: "Después de la cena",
    condition: "Colesterol elevado",
    guide: [
      "Tomar por la noche, cuando la síntesis de colesterol es mayor.",
      "Evitar el jugo de pomelo durante el tratamiento.",
      "Avisar ante dolores musculares persistentes.",
    ],
  },
  {
    id: "levotiroxina",
    name: "Levotiroxina 50 mcg",
    dose: "1 comp",
    schedule: "1 comp · 7:00 en ayunas",
    hour: "07",
    severity: "safe",
    taken: true,
    meal: "En ayunas",
    condition: "Hipotiroidismo",
    guide: [
      "Tomar 30 min antes del desayuno, con el estómago vacío.",
      "Evitar café, calcio y hierro en las 4 h siguientes.",
      "Mantener siempre el mismo horario.",
    ],
  },
];

export const interactions = [
  {
    id: "sim-amox",
    severity: "alert" as Severity,
    title: "Interacción: precaución",
    body: "Simvastatina + Amoxicilina. Espacia ambas dosis al menos 2 h y consulta a tu farmacéutico antes de la siguiente toma.",
  },
  {
    id: "levo-cafe",
    severity: "warn" as Severity,
    title: "Absorción reducida",
    body: "La Levotiroxina junto al café puede reducir su absorción hasta un 30%. Separá al menos 60 minutos.",
  },
  {
    id: "met-ok",
    severity: "safe" as Severity,
    title: "Compatible",
    body: "La Metformina no presenta interacciones con el resto de tu plan actual.",
  },
];

export const scanResult = {
  name: "Metformina 500 mg",
  confidence: "98% cierto",
  detail: "Blíster de 30 comprimidos · Detectado en el marco",
};
