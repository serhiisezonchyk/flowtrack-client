import inMemoryJWT from '@/lib/inMemoryJWT';
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import AuthService from './auth.service';
import { toast } from 'react-toastify';

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosRequestHeaders;
}

const $host = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL + '/api',
  withCredentials: true,
});

const $authHost = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL + '/api',
  withCredentials: true,
});

const authInterceptor = (
  config: AdaptAxiosRequestConfig
): AdaptAxiosRequestConfig => {
  const accessToken = inMemoryJWT.getToken();
  if (accessToken) config.headers.authorization = `Bearer ${accessToken}`;
  return config;
};
$authHost.interceptors.request.use(authInterceptor, (error) =>
  Promise.reject(error)
);

$authHost.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const resp = await AuthService.refresh();
        inMemoryJWT.setToken(resp.accessToken, resp.accessTokenExpiration);
      } catch (error) {
        toast.error('Session expired.')
        return Promise.reject(error);
      }
      return $authHost(originalRequest);
    }
    return Promise.reject(error);
  }
);
export { $host, $authHost };
