import { useId, useState } from "react";
import { todayISO } from "../utils/date.js";

function toFormValues(absence) {
  if (!absence) {
    return { date: todayISO(), justified: false, note: "" };
  }
  return {
    date: absence.date,
    justified: absence.justified,
    note: absence.note ?? "",
  };
}

export default function AbsenceForm({ absence, onSubmit, onCancel }) {
  const id = useId();
  const [values, setValues] = useState(() => toFormValues(absence));
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        date: values.date,
        justified: values.justified,
        note: values.note.trim() || null,
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  const inputClass = "w-full rounded-md border border-slate-300 px-3 py-1.5";

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm"
    >
      <h2 className="text-lg font-semibold">
        {absence ? "Editar falta" : "Registrar falta"}
      </h2>

      {error && (
        <p
          role="alert"
          className="rounded-md bg-red-50 p-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <label htmlFor={`${id}-date`} className="text-sm font-medium">
        Data (cada falta conta 2)
        <input
          id={`${id}-date`}
          name="date"
          type="date"
          value={values.date}
          onChange={handleChange}
          required
          max={todayISO()}
          className={inputClass}
        />
      </label>

      <label htmlFor={`${id}-note`} className="text-sm font-medium">
        Observação (opcional)
        <input
          id={`${id}-note`}
          name="note"
          value={values.note}
          onChange={handleChange}
          maxLength={200}
          className={inputClass}
        />
      </label>

      <label
        htmlFor={`${id}-justified`}
        className="flex items-center gap-2 text-sm"
      >
        <input
          id={`${id}-justified`}
          name="justified"
          type="checkbox"
          checked={values.justified}
          onChange={handleChange}
        />
        Falta justificada (não conta no limite)
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
