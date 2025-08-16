import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

export function useRefState<T>(
  defaultValue: T
): [RefObject<T>, Dispatch<SetStateAction<T>>] {
  const stateRef = useRef<T>(defaultValue);
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  return [stateRef, setState];
}
