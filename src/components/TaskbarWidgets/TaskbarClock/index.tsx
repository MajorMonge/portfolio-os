import { $localeStore } from "@/store/LocaleStore";
import { useStore } from "@nanostores/preact";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";

export default function TaskbarClock({}) {
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

  return (
    <div class="flex flex-col items-center justify-center">
      <span className="countdown text-xl text-primary">
        <span
          style={{ "--value": hours }}
          aria-live="polite"
          aria-label={hours}
        >
          {hours}
        </span>
        :
        <span
          style={{ "--value": minutes }}
          aria-live="polite"
          aria-label={minutes}
        >
          {minutes}
        </span>
        :
        <span
          style={{ "--value": seconds }}
          aria-live="polite"
          aria-label={seconds}
        >
          {seconds}
        </span>
      </span>
      <span class="text-sm text-base-content/70 mt-1">
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
