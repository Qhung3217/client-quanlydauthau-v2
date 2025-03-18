'use client';

import { useRef, useEffect } from 'react';

export default function useDebounceCallback(
  callback: (...args: any[]) => void,
  delay: number = 500
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  return (...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  };
}
