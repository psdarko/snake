import { useState, useEffect } from 'react';
import useEventListener from './useEventListener';
interface WindowSize {
  width: number
  height: number
}

function getWindowSize(): WindowSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export default function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>(getWindowSize);
  useEventListener('resize', () => setWindowSize(getWindowSize()));

  return windowSize;
}