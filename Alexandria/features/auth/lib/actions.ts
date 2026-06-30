"use server";

import { login as serviceLogin, registerMember as serviceRegisterMember } from "@/lib/services/auth-service";
import type { RegisterPayload } from "./auth-contract";

export async function loginAction(email: string, password: string) {
  return serviceLogin(email, password);
}

export async function registerAction(payload: RegisterPayload) {
  return serviceRegisterMember(payload);
}
