import type {
  CurrentUser,
  RegisterPayload,
  ServiceResult,
} from "./auth-contract";
import { loginAction, registerAction } from "./actions";

export type AuthGateway = {
  login(email: string, password: string): Promise<ServiceResult<CurrentUser>>;
  registerMember(
    payload: RegisterPayload,
  ): Promise<ServiceResult<{ id: string }>>;
};

export const authGateway: AuthGateway = {
  login: loginAction,
  registerMember: registerAction,
};
