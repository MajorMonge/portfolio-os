import { h, type JSX } from "preact";
import { useEffect } from "preact/hooks";
import { useTranslation } from "@/i18n";

interface WindowTopbarProps {
  title: string | JSX.Element;
  isActive?: boolean;
  onMouseDown: (e: MouseEvent) => void;
  onTouchStart?: (e: TouchEvent) => void;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export default function WindowTopbar({
  title,
  isActive = true,
  onMouseDown,
  onTouchStart,
  onClose,
  onMinimize,
  onMaximize,
}: WindowTopbarProps) {
  const { t } = useTranslation();

  return (
    <div
      class={`flex items-center justify-between border-b-2 border-base-300/70 topbar bg-base-200 ${
        isActive && "bg-base-300 topbar-active"
      }`}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <div class="flex items-center min-w-0 flex-1 select-none">
        {typeof title === "string" ? (
          <span
            title={title}
            class={`text-base font-medium text-base-content truncate pl-2 py-2 opacity-50 topbar-title  ${
              isActive && "opacity-100 topbar-title-active"
            }`}
          >
            {title}
          </span>
        ) : (
          title
        )}
      </div>

      <div class="flex items-center gap-1 p-2 topbar-buttons">
        <button
          class={`btn btn-sm btn-square opacity-50 ${
            isActive && "opacity-100"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onMinimize && onMinimize();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          type="button"
          title={t("window.minimize")}
        >
          −
        </button>

        <button
          class={`btn btn-sm btn-square opacity-50 ${
            isActive && "opacity-100"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onMaximize && onMaximize();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          type="button"
          title={t("window.maximize")}
        >
          □
        </button>
        <button
          class={`btn btn-sm btn-square btn-error  opacity-50 ${
            isActive && "opacity-100"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onClose && onClose();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          type="button"
          title={t("window.close")}
        >
          ×
        </button>
      </div>
    </div>
  );
}
