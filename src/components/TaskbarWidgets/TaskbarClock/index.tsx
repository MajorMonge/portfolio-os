import { $localeStore } from "@/store/LocaleStore";
import { useStore } from "@nanostores/preact";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";

interface TaskbarClockProps {
  position?: "left" | "right" | "bottom" | "top";
}

export default function TaskbarClock({
  position = "bottom",
}: TaskbarClockProps) {
  const now = new Date();
  const activeLocale = useStore($localeStore);

  const [hours, setHours] = useState(
    now.getHours().toString().padStart(2, "0")
  );
  const [minutes, setMinutes] = useState(
    now.getMinutes().toString().padStart(2, "0")
  );
  const [seconds, setSeconds] = useState(
    now.getSeconds().toString().padStart(2, "0")
  );

  const [date, setDate] = useState(now);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = new Date();
      setHours(current.getHours().toString().padStart(2, "0"));
      setMinutes(current.getMinutes().toString().padStart(2, "0"));
      setSeconds(current.getSeconds().toString().padStart(2, "0"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isVertical = position === "left" || position === "right";

  return (
    <div
      class={`flex flex-col items-center justify-center text-center taskbar-clock text-xl leading-tight text-primary`}
    >
      <div class={`countdown items-center justify-center gap-1 ${isVertical ? "flex-col " : "flex-row "}`}>
        <span
          className="font-bold"
          style={{ "--value": hours }}
          aria-live="polite"
          aria-label={hours}
        >
          {hours}
        </span>
        {!isVertical ? ":" : null}
        <span
          className="font-bold"
          style={{ "--value": minutes }}
          aria-live="polite"
          aria-label={minutes}
        >
          {minutes}
        </span>
        {!isVertical ? ":" : null}
        <span
          className="font-bold"
          style={{ "--value": seconds }}
          aria-live="polite"
          aria-label={seconds}
        >
          {seconds}
        </span>
      </div>
      <span
        class={`text-base-content/70 text-[0.65rem] px-1 ${
          isVertical ? "mt-5" : ""
        }`}
      >
        {date.toLocaleDateString(activeLocale, {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    </div>
  );
}
