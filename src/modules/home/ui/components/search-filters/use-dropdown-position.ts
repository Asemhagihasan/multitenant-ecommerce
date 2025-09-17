import { RefObject } from "react";

export const useDropdownPosition = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) => {
  const getDropDownPosition = () => {
    if (!ref.current) {
      return { top: 0, left: 0 };
    }

    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240; // width of the dropdown (w-60 = 15rem = 240px)

    // Calculate the initial position

    let left = rect.left + window.scrollX;
    const top = rect.top + window.scrollY;

    // Check if the dropdown will go off the right of the viewport

    if (left + dropdownWidth > window.innerWidth) {
      // Align to right edge of button insted
      left = rect.right + window.scrollX - dropdownWidth;

      // If still off-screen, align to the right of viewport with some padding
      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16;
      }
    }
    if (left < 0) {
      left = 16;
    }
    return { top, left };
  };

  return { getDropDownPosition };
};
