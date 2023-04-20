import {useCallback, useRef} from "react";

type TimeoutId = ReturnType<typeof setTimeout>;

export const useCallbackTimer = (): [
  (callback: any, interval?: number) => void,
  () => void
] => {
  let timer = useRef<TimeoutId | null>(null);

  const start = useCallback((callback, interval = 10000) => {
    if (!timer.current) {
      timer.current = setInterval(callback, interval);
    }
  }, []);

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  return [start, stop];
};
