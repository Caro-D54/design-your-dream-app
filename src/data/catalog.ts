// Catálogo de medicamentos reales, con información de prospecto.
export type CatalogItem = {
  name: string;
  strength: string;
  dose: string;
  times: string[];
  meal: string;
  condition: string;
  guide: string[];
};

export const catalog: CatalogItem[] = [
  {
    name: "Metformina",
    strength: "500 mg",
    dose: "1 comprimido",
    times: ["08:00", "20:00"],
    meal: "Con las comidas",
    condition: "Diabetes tipo 2 · resistencia a la insulina",
    guide: [
      "Tomar junto al desayuno y la cena para reducir molestias digestivas.",
      "No partir ni masticar los comprimidos de liberación prolongada.",
      "Beber un vaso de agua completo con cada toma.",
    ],
  },
  {
    name: "Levotiroxina",
    strength: "50 mcg",
    dose: "1 comprimido",
    times: ["07:00"],
    meal: "En ayunas",
    condition: "Hipotiroidismo",
    guide: [
      "Tomar 30 a 60 minutos antes del desayuno, con el estómago vacío.",
      "Separar 4 horas de calcio, hierro y antiácidos.",
      "Mantener siempre el mismo horario.",
    ],
  },
  {
    name: "Amoxicilina",
    strength: "500 mg",
    dose: "1 cápsula",
    times: ["08:00", "16:00", "00:00"],
    meal: "Indistinto",
    condition: "Infección bacteriana · 7 días",
    guide: [
      "Mantener intervalos de 8 horas entre tomas.",
      "Completar el tratamiento aunque los síntomas desaparezcan.",
      "Avisar al médico ante erupción en la piel.",
    ],
  },
  {
    name: "Simvastatina",
    strength: "20 mg",
    dose: "1 comprimido",
    times: ["21:00"],
    meal: "Después de la cena",
    condition: "Colesterol elevado",
    guide: [
      "Tomar por la noche, cuando el cuerpo produce más colesterol.",
      "Evitar el jugo de pomelo durante el tratamiento.",
      "Consultar ante dolores musculares persistentes.",
    ],
  },
  {
    name: "Enalapril",
    strength: "10 mg",
    dose: "1 comprimido",
    times: ["09:00"],
    meal: "Indistinto",
    condition: "Hipertensión arterial",
    guide: [
      "Tomar siempre a la misma hora, con o sin alimentos.",
      "Evitar sustitutos de la sal ricos en potasio.",
      "Puede dar tos seca persistente: avisar al médico.",
    ],
  },
  {
    name: "Ibuprofeno",
    strength: "400 mg",
    dose: "1 comprimido",
    times: ["09:00", "17:00"],
    meal: "Con las comidas",
    condition: "Dolor o inflamación",
    guide: [
      "Tomar con comida para proteger el estómago.",
      "No superar 1200 mg por día sin indicación médica.",
      "Evitar combinarlo con otros antiinflamatorios.",
    ],
  },
  {
    name: "Omeprazol",
    strength: "20 mg",
    dose: "1 cápsula",
    times: ["07:30"],
    meal: "En ayunas",
    condition: "Acidez · protección gástrica",
    guide: [
      "Tomar 30 minutos antes del desayuno.",
      "Tragar la cápsula entera, sin abrirla.",
      "Puede reducir la absorción de hierro y vitamina B12.",
    ],
  },
  {
    name: "Losartán",
    strength: "50 mg",
    dose: "1 comprimido",
    times: ["09:00"],
    meal: "Indistinto",
    condition: "Hipertensión arterial",
    guide: [
      "Tomar a la misma hora cada día.",
      "Controlar la presión de forma periódica.",
      "Evitar antiinflamatorios prolongados, reducen su efecto.",
    ],
  },
];

export const mealOptions = [
  "Indistinto",
  "En ayunas",
  "Con las comidas",
  "Antes de las comidas",
  "Después de la cena",
];
