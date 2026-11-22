import { useId, useState } from "react";

const EMPTY_FORM = {
  name: "",
  professor: "",
  total_classes: "",
  absence_limit_percent: 25,
};

function toFormValues(subject) {
  if (!subject) {
    return EMPTY_FORM;
  }
  return {
    name: subject.name,
    professor: subject.professor ?? "",
    total_classes: subject.total_classes,
    absence_limit_percent: subject.absence_limit_percent,
  };
}

export default function SubjectForm({ subject, onSubmit, onCancel }) {
  const id = useId();
  const [values, setValues] = useState(() => toFormValues(subject));
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        name: values.name,
        professor: values.professor || null,
        total_classes: Number(values.total_classes),
        absence_limit_percent: Number(values.absence_limit_percent),
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
        {subject ? "Editar disciplina" : "Nova disciplina"}
      </h2>

      {error && (
        <p
          role="alert"
          className="rounded-md bg-red-50 p-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <label htmlFor={`${id}-name`} className="text-sm font-medium">
        Nome
        <input
          id={`${id}-name`}
          name="name"
          value={values.name}
          onChange={handleChange}
          required
          maxLength={100}
          className={inputClass}
        />
      </label>

      <label htmlFor={`${id}-professor`} className="text-sm font-medium">
        Professor (opcional)
        <input
          id={`${id}-professor`}
          name="professor"
          value={values.professor}
          onChange={handleChange}
          maxLength={100}
          className={inputClass}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label htmlFor={`${id}-total`} className="text-sm font-medium">
          Total de aulas no semestre
          <input
            id={`${id}-total`}
            name="total_classes"
            type="number"
            value={values.total_classes}
            onChange={handleChange}
            required
            min={1}
            max={200}
            className={inputClass}
          />
        </label>

        <label htmlFor={`${id}-percent`} className="text-sm font-medium">
          Faltas permitidas (% das aulas)
          <input
            id={`${id}-percent`}
            name="absence_limit_percent"
            type="number"
            value={values.absence_limit_percent}
            onChange={handleChange}
            required
            min={1}
            max={100}
            className={inputClass}
          />
        </label>
      </div>

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
