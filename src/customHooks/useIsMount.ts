import { useRef, useEffect } from "react";

export const useIsMount = () => {
  const ref = useRef(true);
  
  useEffect(() => {
    ref.current = false;
  }, []);
  return ref.current
}