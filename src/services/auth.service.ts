import { User } from '@/data/types';
import { $authHost, $host } from '@/services';
import { SignInSchemaType } from '@/validation/schemas';

export interface SignInResponse {
  accessToken: string;
  accessTokenExpiration: number;
  data: User;
}

export interface SignUpResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export default class AuthService {
  static signIn = async (body: SignInSchemaType) => {
    const { data } = await $host.post<SignInResponse>('/auth/sign-in', body);
    return data;
  };
  static signUp = async (body: SignInSchemaType) => {
    const { data } = await $host.post<SignUpResponse>('/auth/sign-up', body);
    return data;
  };
  static logout = async () => {
    const { data } = await $authHost.post<LogoutResponse>('/auth/logout');
    return data;
  };
  static refresh = async () => {
    const { data } = await $authHost.post<SignInResponse>('/auth/refresh');
    return data;
  };
}
