import { $authHost, $host } from '@/services';
import { ResponseType, User } from '@/types';
import { SignInSchemaType } from '@/validation/schemas';

export interface SignInResponse {
  accessToken: string;
  accessTokenExpiration: number;
  data: User;
}

export default class AuthService {
  static signIn = async (body: SignInSchemaType) => {
    const { data } = await $host.post<SignInResponse>('/auth/sign-in', body);
    return data;
  };
  static signUp = async (body: SignInSchemaType) => {
    const { data } = await $host.post<Omit<ResponseType, 'data'>>('/auth/sign-up', body);
    return data;
  };
  static logout = async () => {
    const { data } = await $authHost.post<Omit<ResponseType, 'data'>>('/auth/logout');
    return data;
  };
  static refresh = async () => {
    const { data } = await $authHost.post<SignInResponse>('/auth/refresh');
    return data;
  };
}
