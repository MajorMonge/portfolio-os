import { h } from "preact";
import { $themeStore } from "@/store/ThemeStore";
import { useEffect } from "preact/hooks";
import { useStore } from "@nanostores/preact";

export default function ThemeSelector() {
  const themes = [
    "win95",
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ];
  const activeTheme = useStore($themeStore);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", activeTheme);
  }, [activeTheme]);

  const setActiveTheme = (theme: string) => {
    $themeStore.set(theme);
  };

  return (
    <div className="dropdown dropdown-top flex align-center justify-center">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-square my-auto"
      >
        🎨
      </div>
      <ul
        tabIndex={0}
        class="dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-2xl mr-2 overflow-y-auto max-h-100"
      >
        {themes.map((theme) => (
          <li key={theme}>
            <input
              type="radio"
              name="theme-dropdown"
              class={`theme-controller w-full btn btn-sm btn-block btn-ghost justify-start ${
                activeTheme === theme ? "btn-active" : ""
              }`}
              aria-label={theme}
              value={theme}
              onChange={() => setActiveTheme(theme)}
              checked={activeTheme === theme}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
