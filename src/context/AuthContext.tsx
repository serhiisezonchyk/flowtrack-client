import inMemoryJWT from '@/lib/inMemoryJWT';
import AuthService from '@/services/auth.service';
import { User } from '@/types';
import React, { createContext, useEffect, useState } from 'react';
interface AuthContextState {
  isAuth: null | User;
  isAuthInProgress: boolean;
  login: ({ login, password }: { login: string; password: string }) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}
export const AuthContext = createContext<AuthContextState>({
  isAuth: null,
  isAuthInProgress: false,
  login: async () => {},
  checkAuth: async () => {},
  logout: async () => {},
});

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useState<null | User>(null);
  const [isAuthInProgress, setIsAuthInProgress] = useState(false);

  const login = async ({ login, password }: { login: string; password: string }) => {
    setIsAuthInProgress(true);
    try {
      const resp = await AuthService.signIn({ login, password });
      inMemoryJWT.setToken(resp.accessToken, resp.accessTokenExpiration);
      setIsAuth(resp.data);
    } finally {
      setIsAuthInProgress(false);
    }
  };

  const checkAuth = async () => {
    setIsAuthInProgress(true);
    try {
      const resp = await AuthService.refresh();
      inMemoryJWT.setToken(resp.accessToken, resp.accessTokenExpiration);
      setIsAuth(resp.data);
    } catch (error) {
      setIsAuth(null);
      inMemoryJWT.removeToken();
    } finally {
      setIsAuthInProgress(false);
    }
  };

  const logout = async () => {
    setIsAuthInProgress(true);
    try {
      await AuthService.logout();
      setIsAuth(null);
      inMemoryJWT.removeToken();
    } catch (err) {
      console.log('logout error', err);
    } finally {
      setIsAuthInProgress(false);
    }
  };

  useEffect(() => {
    const handlePersistedLogout = (event: StorageEvent) => {
      if (event.key === 'logout') {
        setIsAuthInProgress(false);
        setIsAuth(null);
        inMemoryJWT.removeToken();
      }
    };
    window.addEventListener('storage', handlePersistedLogout);
    return () => {
      window.removeEventListener('storage', handlePersistedLogout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, isAuthInProgress, login, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
