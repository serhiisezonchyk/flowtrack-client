const inMemoryJWTService = () => {
  let inMemoryJWT: string | null = null;
  const getToken = () => inMemoryJWT;

  const setToken = (token: string, tokenExpiration: number) => {
    inMemoryJWT = token;
  };
  const removeToken = () => {
    inMemoryJWT = null;
    localStorage.setItem('logout', Date.now().toString());
  };
  return { getToken, setToken, removeToken };
};

export default inMemoryJWTService();
