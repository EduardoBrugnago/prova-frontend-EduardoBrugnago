import { useCallback, useState } from 'react';

export interface UseDisclosureReturn<TData> {
  isOpen: boolean;
  data: TData | null;
  open: (data?: TData) => void;
  close: () => void;
  toggle: () => void;
}

export function useDisclosure<TData = void>(): UseDisclosureReturn<TData> {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<TData | null>(null);

  const open = useCallback((value?: TData) => {
    setData(value ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const toggle = useCallback(() => setIsOpen((current) => !current), []);

  return { isOpen, data, open, close, toggle };
}
