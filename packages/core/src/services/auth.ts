import { getUserRepository } from '@cocos-challenge/db';

export const getUserById = async (id: number) => {
  const user = await getUserRepository().findOneBy({ id });

  return user;
};

export * as AuthService from './auth';
