import { useRef, useState, useEffect } from "preact/hooks";
import { getDropdownClasses } from "../getPosition";
import type { TaskbarPosition } from "../../store/TaskbarStore";

export function useDropdownPosition(taskbarPosition: TaskbarPosition) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [dropdownClasses, setDropdownClasses] = useState(
    getDropdownClasses(taskbarPosition)
  );

  useEffect(() => {
    const updateClasses = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      setDropdownClasses(getDropdownClasses(taskbarPosition, rect));
    };

    updateClasses();
    window.addEventListener("resize", updateClasses);

    return () => window.removeEventListener("resize", updateClasses);
  }, [taskbarPosition]);

  return { buttonRef, dropdownClasses };
}
