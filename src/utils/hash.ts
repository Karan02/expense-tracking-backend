import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (plain: string, hash: string) => {
  return await bcrypt.compare(plain, hash);
};