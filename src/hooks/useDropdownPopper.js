import { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import { useOnClickOutside } from "./useOnClickOutside";

export const useDropdownPopper = (popperOptions, onClose) => {
  const [referenceElement, setReferenceElement] = useState();
  const [popperElement, setPopperElement] = useState();
  const closeRef = useOnClickOutside(() => setExpand(false));
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    if (!expand) {
      onClose?.();
    }
  }, [expand]);

  let {
    styles: popperStyles,
    attributes,
    update,
  } = usePopper(referenceElement, popperElement, {
    strategy: "fixed",
    placement: "bottom-start",
    ...(popperOptions || {}),
    modifiers: [
      { name: "offset", options: { offset: [0, 8] } },
      ...(popperOptions?.modifiers || []),
    ],
  });

  popperStyles.popper = { ...popperStyles.popper, zIndex: 1 };

  return {
    popperStyles,
    attributes,
    update,
    setReferenceElement,
    setPopperElement,
    expand,
    setExpand,
    closeRef,
  };
};
