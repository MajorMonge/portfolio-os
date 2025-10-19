import { h, type JSX } from "preact";
import { useState, useEffect } from "preact/hooks";

interface FullframeLoaderProps {
  isLoading: boolean;
}

export default function FullframeLoader({
  isLoading,
}: FullframeLoaderProps): JSX.Element | null {
  const [shouldRender, setShouldRender] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setFadeOut(true);

      const timeout = setTimeout(() => {
        setShouldRender(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      class={`fixed inset-0 bg-accent flex items-center justify-center z-[1000] transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <span class="loading loading-spinner loading-xl text-secondary-content"></span>
    </div>
  );
}
