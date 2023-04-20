import { useRef, useCallback } from "react";

type UseLongPolling = [start: (callback: any, interval: number) => void, stop: () => void]

export const useLongPolling = (): UseLongPolling => {
  let timer = useRef<NodeJS.Timer | null>(null);

  const start = useCallback((callback, interval = 10000) => {
    if (!timer.current) {
      timer.current = setInterval(callback, interval);
    }
  }, []);

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval((timer.current as unknown) as number);
      timer.current = null;
    }
  }, []);

  return [start, stop];
};
