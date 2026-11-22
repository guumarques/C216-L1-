export const STATUS = {
  ok: {
    label: "Regular",
    badge: "bg-emerald-100 text-emerald-800",
    bar: "bg-emerald-500",
  },
  at_risk: {
    label: "Em risco",
    badge: "bg-amber-100 text-amber-800",
    bar: "bg-amber-500",
  },
  failed: {
    label: "Reprovado",
    badge: "bg-red-100 text-red-800",
    bar: "bg-red-500",
  },
};

export function usagePercent(used, limit) {
  if (limit <= 0) {
    return used > 0 ? 100 : 0;
  }
  return Math.min(Math.round((used / limit) * 100), 100);
}
