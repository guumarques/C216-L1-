import { useState } from "react";
import { validateUser } from "../validation";

const EMPTY_USER = { name: "", email: "" };

export function UserForm({
  onSubmit,
  onCancel,
  initialValues = EMPTY_USER,
  submitLabel = "Adicionar",
  idPrefix = "user",
}) {
  const [name, setName] = useState(initialValues.name);
  const [email, setEmail] = useState(initialValues.email);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const result = validateUser({ name, email });
    setErrors(result.errors);
    setSubmitError("");
    if (Object.keys(result.errors).length > 0) return;

    setSaving(true);
    try {
      await onSubmit(result.values);
      setName("");
      setEmail("");
    } catch (error) {
      // Mantém o que foi digitado para o usuário poder corrigir.
      setSubmitError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="space-y-1">
        <label
          htmlFor={`${idPrefix}-name`}
          className="block text-sm font-medium"
        >
          Nome
        </label>
        <input
          id={`${idPrefix}-name`}
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? `${idPrefix}-name-error` : undefined}
          className="w-full rounded border border-slate-300 p-2"
        />
        {errors.name && (
          <p
            id={`${idPrefix}-name-error`}
            role="alert"
            className="text-sm text-red-700"
          >
            {errors.name}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <label
          htmlFor={`${idPrefix}-email`}
          className="block text-sm font-medium"
        >
          E-mail
        </label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={
            errors.email ? `${idPrefix}-email-error` : undefined
          }
          className="w-full rounded border border-slate-300 p-2"
        />
        {errors.email && (
          <p
            id={`${idPrefix}-email-error`}
            role="alert"
            className="text-sm text-red-700"
          >
            {errors.email}
          </p>
        )}
      </div>
      {submitError && (
        <p role="alert" className="rounded bg-red-50 p-2 text-sm text-red-700">
          {submitError}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-slate-300 px-4 py-2 font-medium hover:bg-slate-100"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
