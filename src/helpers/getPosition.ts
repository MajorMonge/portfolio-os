import type { TaskbarPosition } from "../store/TaskbarStore";

export function getOppositePosition(taskbarPosition: TaskbarPosition): TaskbarPosition {
  const positionMap: Record<TaskbarPosition, TaskbarPosition> = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  };

  return positionMap[taskbarPosition];
}

export function getTooltipClasses(taskbarPosition: TaskbarPosition): string {
  const oppositePosition = getOppositePosition(taskbarPosition);
  return `tooltip tooltip-${oppositePosition}`;
}

/**
 * Calculates the optimal dropdown alignment based on the element's position in the viewport
 * to prevent overflow. This function should be called within a component that has access
 * to the element's position.
 *
 * @param taskbarPosition - The current position of the taskbar
 * @param elementRect - The bounding rectangle of the dropdown trigger element (optional)
 * @returns Complete DaisyUI dropdown class string with smart alignment
 *
 * @example
 * // In a component with a ref:
 * const ref = useRef<HTMLDivElement>(null);
 * const classes = getDropdownClasses('left', ref.current?.getBoundingClientRect());
 */
export function getDropdownClasses(
  taskbarPosition: TaskbarPosition,
  elementRect?: DOMRect | null
): string {
  const oppositePosition = getOppositePosition(taskbarPosition);

  let alignment: "start" | "center" | "end" = "center";

  if (elementRect) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // For horizontal taskbars (top/bottom)
    if (taskbarPosition === "top" || taskbarPosition === "bottom") {
      const elementCenterX = elementRect.left + elementRect.width / 2;
      const leftSpace = elementRect.left;
      const rightSpace = viewportWidth - elementRect.right;

      // If element is in the left third of the screen and has less space on the left
      if (elementCenterX < viewportWidth / 3 && leftSpace < rightSpace) {
        alignment = "start";
      }
      // If element is in the right third of the screen and has less space on the right
      else if (elementCenterX > (viewportWidth * 2) / 3 && rightSpace < leftSpace) {
        alignment = "end";
      }
      // Otherwise use center (default)
      else {
        alignment = "center";
      }
    }
    // For vertical taskbars (left/right)
    else {
      const elementCenterY = elementRect.top + elementRect.height / 2;
      const topSpace = elementRect.top;
      const bottomSpace = viewportHeight - elementRect.bottom;

      // If element is in the top third of the screen and has less space on top
      if (elementCenterY < viewportHeight / 3 && topSpace < bottomSpace) {
        alignment = "start";
      }
      // If element is in the bottom third of the screen and has less space on bottom
      else if (elementCenterY > (viewportHeight * 2) / 3 && bottomSpace < topSpace) {
        alignment = "end";
      }
      // Otherwise use center (default)
      else {
        alignment = "center";
      }
    }
  } else {
    // Fallback when elementRect is not provided
    alignment = (taskbarPosition === "top" || taskbarPosition === "bottom")
      ? "center"
      : "end";
  }

  return `dropdown dropdown-${oppositePosition} dropdown-${alignment}`;
}
