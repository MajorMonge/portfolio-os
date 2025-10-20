import { persistentAtom } from "@nanostores/persistent";

export const themes = [
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
    "sunset"
];

export const $themeStore = persistentAtom<string>("themeStore", "win95", {
  encode: (value) => value,
  decode: (value) => value || "win95",
});

export function setTheme(theme: string) {
  $themeStore.set(theme);
}

export function getTheme(): string {
  return $themeStore.get();
}
