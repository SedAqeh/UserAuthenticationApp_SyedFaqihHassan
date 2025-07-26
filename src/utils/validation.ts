export const isValidEmail = (email: string) =>
  !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPassword = (password: string) =>
  !!password && password.length >= 6;

export const isFilled = (...fields: string[]) =>
  fields.every((f) => f.trim().length > 0);
