// "2026-11-20" -> "20/11/2026" (sem usar Date, para não sofrer com fuso horário)
export function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

// Data de hoje no fuso do navegador, no formato "AAAA-MM-DD"
export function todayISO() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}
