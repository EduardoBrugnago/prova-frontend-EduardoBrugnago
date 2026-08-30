const KEY = 'app.refresh_token';

export const refreshStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  },
  set(token: string) {
    try {
      localStorage.setItem(KEY, token);
    } catch {
      //TODO
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      //TODO
    }
  },
};
