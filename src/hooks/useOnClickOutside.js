import { useEffect, useRef } from "react";

export function useOnClickOutside(handler, elements) {
  const ref = useRef(null);

  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (
        (!ref.current || ref.current.contains(event.target)) &&
        (!elements ||
          elements.filter((el) => el?.contains?.(event.target)).length > 0)
      ) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [handler, elements]);

  return ref;
}
