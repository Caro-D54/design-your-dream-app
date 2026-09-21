import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ScanReading = {
  found: boolean;
  name: string;
  strength: string;
  dose: string;
  times: string[];
  meal: string;
  condition: string;
  guide: string[];
  confidence: number;
  detail: string;
};

const SYSTEM = `Sos un lector de etiquetas de medicamentos. Analizás la foto de una caja, blíster o receta y devolvés SOLO los datos legibles.
Respondé en español rioplatense. Si la imagen no muestra un medicamento, devolvé found=false.
Inferí horarios concretos (HH:MM) a partir de la frecuencia impresa: "cada 8 horas" -> ["08:00","16:00","00:00"], "1 vez al día" -> ["09:00"].
La guía debe tener 2 o 3 indicaciones breves de toma, basadas en el prospecto del principio activo detectado.`;

const schema = {
  name: "lectura_etiqueta",
  description: "Datos leídos de la etiqueta del medicamento",
  parameters: {
    type: "object",
    properties: {
      found: { type: "boolean" },
      name: { type: "string", description: "Nombre o principio activo" },
      strength: { type: "string", description: "Concentración, ej 500 mg" },
      dose: { type: "string", description: "Cantidad por toma, ej 1 comprimido" },
      times: { type: "array", items: { type: "string" }, description: "Horarios HH:MM" },
      meal: { type: "string" },
      condition: { type: "string" },
      guide: { type: "array", items: { type: "string" } },
      confidence: { type: "number", description: "0 a 1" },
      detail: { type: "string", description: "Qué se vio en la imagen" },
    },
    required: ["found", "name", "strength", "dose", "times", "meal", "guide", "confidence", "detail"],
    additionalProperties: false,
  },
} as const;

export const scanLabel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { image: string }) => {
    const image = String(data.image ?? "");
    if (!image.startsWith("data:image/")) throw new Error("Imagen inválida");
    if (image.length > 8_000_000) throw new Error("La foto es demasiado grande");
    return { image };
  })
  .handler(async ({ data }): Promise<ScanReading> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Falta la configuración del lector de etiquetas");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: [
              { type: "text", text: "Leé esta etiqueta y devolvé los datos del medicamento." },
              { type: "image_url", image_url: { url: data.image } },
            ],
          },
        ],
        tools: [{ type: "function", function: schema }],
        tool_choice: { type: "function", function: { name: schema.name } },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`OCR gateway failed [${response.status}]: ${body}`);
      if (response.status === 429) throw new Error("Muchas lecturas seguidas. Probá de nuevo en un minuto.");
      if (response.status === 402) throw new Error("Se agotaron los créditos de lectura de etiquetas.");
      throw new Error("No pudimos leer la etiqueta. Probá con más luz.");
    }

    const payload = (await response.json()) as {
      choices?: { message?: { tool_calls?: { function?: { arguments?: string } }[] } }[];
    };
    const args = payload.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) throw new Error("No pudimos leer la etiqueta. Probá con más luz.");

    const parsed = JSON.parse(args) as Partial<ScanReading>;
    const times = (parsed.times ?? []).map((t) => String(t).slice(0, 5)).filter((t) => /^\d{2}:\d{2}$/.test(t));

    return {
      found: parsed.found !== false && Boolean(parsed.name),
      name: parsed.name ?? "",
      strength: parsed.strength ?? "",
      dose: parsed.dose ?? "1 comprimido",
      times: times.length > 0 ? times : ["09:00"],
      meal: parsed.meal ?? "Indistinto",
      condition: parsed.condition ?? "",
      guide: (parsed.guide ?? []).slice(0, 3),
      confidence: Math.round((parsed.confidence ?? 0.8) * 100),
      detail: parsed.detail ?? "",
    };
  });
