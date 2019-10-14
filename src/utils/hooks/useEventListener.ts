import { useRef, useEffect } from 'react';

export default function useEventListener<K extends keyof HTMLElementEventMap>(eventName: string, handler: (event: HTMLElementEventMap[K]) => void, element: HTMLElement | Window | Document = window): void {
  const savedHandler = useRef<(event: HTMLElementEventMap[K]) => void>(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      // On
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      // Create event listener that calls handler function stored in ref
      const eventListener = (event: any) => savedHandler.current(event);

      // Add event listener
      element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
};