import { RefObject, useCallback, useState, useEffect, useMemo } from "react";

export const getRefElement = <T>(
  element?: RefObject<Element> | T
): Element | T | undefined | null => {
  if (element && "current" in element) {
    return element.current;
  }

  return element;
};

interface Props {
  target?: RefObject<Element> | Element | Node | null;
  options?: MutationObserverInit;
  callback?: MutationCallback;
}

export type HTMLElementOrNull = HTMLElement | null;
export type RefElementOrNull<T> = T | null;
export type CallbackRef = (node: HTMLElementOrNull) => any;

export const useMutationObserver = (
  callback: MutationCallback,
  options?: MutationObserverInit
): [CallbackRef] => {
  const [node, setNode] = useState<HTMLElementOrNull>(null);

  useEffect(() => {
    // Create an observer instance linked to the callback function
    if (node) {
      const observer = new MutationObserver(callback);

      // Start observing the target node for configured mutations
      observer.observe(node, options);

      return () => {
        observer.disconnect();
      };
    }
  }, [callback, node, options]);

  const ref = useCallback((node: HTMLElementOrNull) => {
    setNode(node);
  }, []);

  return [ref];
};
