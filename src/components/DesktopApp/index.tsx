import type { Application } from "@/types/app";
import { openApp } from "@/store/AppStore";
import { getLocalizedAppName } from "@/helpers/appLocalization";
import { $localeStore } from "@/i18n";
import { useStore } from "@nanostores/preact";
import { h } from "preact";

interface DesktopAppProps {
  app: Application;
  onOpen?: (app: Application) => void;
}

export default function DesktopApp({ app }: DesktopAppProps) {
  const locale = useStore($localeStore);
  const localizedName = getLocalizedAppName(app);

  const handleClick = () => {
    openApp(app);
  };

  const isImageUrl =
    typeof app.icon === "string" &&
    (app.icon.startsWith("http://") || app.icon.startsWith("https://"));

  return (
    <div
      class="desktopApp w-26 max-h-30 p-2 flex flex-col items-center justify-end cursor-pointer select-none rounded-box border-2 border-transparent active:border-base-200"
      onClick={handleClick}
      onDblClick={handleClick}
      title={localizedName}
    >
      <div class="flex-shrink-0 flex items-center justify-center text-4xl h-14 w-14 overflow-hidden">
        {isImageUrl ? (
          <img
            src={app.icon as string}
            alt={localizedName}
            class="w-14 h-14 object-contain"
          />
        ) : (
          app.icon
        )}
      </div>
      <div class="w-full h-full">
        <span
          className={`text-sm text-center text-secondary-content overflow-hidden text-ellipsis whitespace-pre-line break-words line-clamp-2`}
        >
          {localizedName}
        </span>
      </div>
    </div>
  );
}
