import { h, type JSX } from 'preact';
import { useEffect } from 'preact/hooks';

interface WindowTopbarProps {
  title: string | JSX.Element;
  onMouseDown: (e: MouseEvent) => void;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export default function WindowTopbar({
  title,
  onMouseDown,
  onClose,
  onMinimize,
  onMaximize
}: WindowTopbarProps) {

  useEffect(() => {
    console.log(onClose, onMinimize, onMaximize);
  }, [onClose, onMinimize, onMaximize]);

  return (
    <div
      class="flex items-center justify-between bg-base-200 border-b-2 border-base-300  topbar"
      onMouseDown={onMouseDown}
    >
      <div class="flex items-center min-w-0 flex-1 select-none">
        {
          typeof title === 'string' ? (
            <span title={title} class="text-base font-medium text-base-content truncate pl-2 py-2 topbar-title">{title}</span>
          ) : (
            title
          )
        }
      </div>

      <div class="flex items-center gap-1 p-2 topbar-buttons">
        <button
          class="btn btn-sm btn-square"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          type="button"
        >
          −
        </button>

        <button
          class="btn btn-sm btn-square"
          onClick={(e) => {
            e.stopPropagation();
            onMaximize && onMaximize();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.stopPropagation();
          }}
          type="button"
        >
          □
        </button>
        <button
          class="btn btn-sm btn-error btn-square"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  );
}
