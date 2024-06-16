import { $authHost } from '.';

export const testPrivate = async () => {
  const { data } = await $authHost.get('/test');
  return data;
};
