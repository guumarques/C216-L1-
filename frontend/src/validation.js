export const NAME_MAX_LENGTH = 100;
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function validateUser({ name, email }) {
  const errors = {};
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  if (!trimmedName) {
    errors.name = "O nome é obrigatório.";
  } else if (trimmedName.length > NAME_MAX_LENGTH) {
    errors.name = `O nome deve ter no máximo ${NAME_MAX_LENGTH} caracteres.`;
  }

  if (!trimmedEmail) {
    errors.email = "O e-mail é obrigatório.";
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = "Informe um e-mail válido.";
  }

  return { errors, values: { name: trimmedName, email: trimmedEmail } };
}
