export const IVA_CONDITIONS: Record<number, string> = {
  1: "IVA Responsable Inscripto",
  4: "IVA Sujeto Exento",
  5: "Consumidor Final",
  6: "Responsable Monotributo",
  7: "Sujeto No Categorizado",
  8: "Proveedor del Exterior",
  9: "Cliente del Exterior",
  10: "IVA Liberado – Ley N° 19.640",
  13: "Monotributista Social",
  15: "IVA No Alcanzado",
  16: "Monotributo Trabajador Independiente Promovido",
};

export const getIvaCondition = (code?: number | null): string => {
  if (!code) return "";
  return IVA_CONDITIONS[code] || "Condición desconocida";
};