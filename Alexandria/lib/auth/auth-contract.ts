import type { Affiliation } from "../services/types";

export type {
  Affiliation,
  CurrentUser,
  RegisterPayload,
  ServiceError,
  ServiceResult,
  UserRole,
} from "../services/types";

export type LoginInput = {
  email: string;
  password: string;
};

export type RegistrationFormInput = {
  profile_name: string;
  email: string;
  usc_id: string;
  affiliation: Affiliation | "";
  password: string;
  confirm_password: string;
};

export type FieldErrors<T> = Partial<Record<keyof T, string>>;
