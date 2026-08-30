import { useEffect, useState } from 'react';

export function useDebounce<TValue>(value: TValue, delay = 400): TValue {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounceValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [value, delay]);

  return debounceValue;
}
