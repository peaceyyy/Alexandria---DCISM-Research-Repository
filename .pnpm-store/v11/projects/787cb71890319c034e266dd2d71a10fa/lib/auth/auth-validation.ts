import type {
  FieldErrors,
  LoginInput,
  RegistrationFormInput,
} from "./auth-contract";

export function isUscEmail(email: string): boolean {
  return /^[^\s@]+@usc\.edu\.ph$/i.test(email.trim());
}

export function validateLoginInput(
  input: LoginInput,
): FieldErrors<LoginInput> {
  const errors: FieldErrors<LoginInput> = {};

  if (!isUscEmail(input.email)) {
    errors.email = "Use your @usc.edu.ph email address.";
  }
  if (!input.password) {
    errors.password = "Enter your password.";
  }

  return errors;
}

export function validateRegistrationInput(
  input: RegistrationFormInput,
): FieldErrors<RegistrationFormInput> {
  const errors: FieldErrors<RegistrationFormInput> = {};

  if (input.profile_name.trim().length < 2) {
    errors.profile_name = "Enter your full name.";
  }
  if (!isUscEmail(input.email)) {
    errors.email = "Use your @usc.edu.ph email address.";
  }
  if (input.affiliation === "student" && !input.usc_id.trim()) {
    errors.usc_id = "USC ID is required for students.";
  } else if (input.usc_id.trim() && !/^\d+$/.test(input.usc_id)) {
    errors.usc_id = "Enter a valid numeric USC ID.";
  }
  if (!input.affiliation) {
    errors.affiliation = "Select your USC affiliation.";
  }
  const pw = input.password;
  if (pw.length < 8) {
    errors.password = "Use at least 8 characters.";
  } else if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw) || !/[0-9]/.test(pw) || !/[^A-Za-z0-9]/.test(pw)) {
    errors.password = "Password must meet all strength requirements.";
  }
  if (input.confirm_password !== input.password) {
    errors.confirm_password = "Passwords do not match.";
  }

  return errors;
}
