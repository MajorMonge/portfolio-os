import { h } from "preact";

interface TaskbarAppProps {
  icon: string | preact.JSX.Element;
  onClick: () => void;
  isActive?: boolean;
}

export default function TaskbarApp({
  icon,
  onClick,
  isActive = false,
}: TaskbarAppProps) {
  const isImageUrl =
    typeof icon === "string" &&
    (icon.startsWith("http://") || icon.startsWith("https://"));

  return (
    <button
      class={`app-icon btn btn-ghost rounded-box flex items-center justify-center h-full text-2xl p-2 text-center relative ${
        isActive ? "btn-active" : ""
      }`}
      onClick={onClick}
    >
      <div class="flex-shrink-0 flex items-center justify-center h-6 w-6">
        {isImageUrl ? (
          <img
            src={icon as string}
            alt="app icon"
            class="h-full w-full object-contain"
          />
        ) : (
          <span class="text-2xl">{icon}</span>
        )}
      </div>
      {isActive ? (
        <span class="app-active absolute bottom-[0.5px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-accent rounded-box"></span>
      ) : (
        <span
          class={
            "app-inactive absolute bottom-[0.5px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-neutral rounded-box"
          }
        ></span>
      )}
    </button>
  );
}
