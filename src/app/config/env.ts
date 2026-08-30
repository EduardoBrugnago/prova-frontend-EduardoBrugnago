export const env = {
  API_URL: import.meta.env.VITE_API_URL ?? 'https://api.escuelajs.co/api/v1',
} as const;
