import { useRef, useCallback } from 'react';

export default function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300,
  deps: any[] = []
): T {
  const ref = useRef<number>();
  return useCallback<T>(((...args) => {
    clearTimeout(ref.current);
    ref.current = window.setTimeout(callback, delay, ...args);
  }) as T, [delay, ...deps]);
}