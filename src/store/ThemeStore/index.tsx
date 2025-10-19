import { persistentAtom } from "@nanostores/persistent";

export const $themeStore = persistentAtom<string>("themeStore", "win95", {
  encode: (value) => value,
  decode: (value) => value || "win95",
});
