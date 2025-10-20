import { h, type JSX } from "preact";
import { useState, useRef, useEffect } from "preact/hooks";
import WindowTopbar from "../WindowTopbar";

interface WindowProps {
  title: string | JSX.Element;
  zIndex?: number;
  visibleTopbar?: boolean;
  children?: any;
  initialX?: number;
  initialY?: number;
  width?: number;
  height?: number;
  stackPosition?: number;
  minimized?: boolean;
  isActive?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onMouseDown?: () => void;
  onPositionChange?: (x: number, y: number) => void;
  onSizeChange?: (width: number, height: number) => void;
  resizable?: boolean;
  movable?: boolean;
  bodyDrag?: boolean;
}

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export default function Window({
  title,
  children,
  visibleTopbar = true,
  initialX = 100,
  initialY = 100,
  width = 400,
  height = 300,
  stackPosition = 500,
  minimized = false,
  isActive = false,
  onClose,
  onMinimize,
  onMaximize,
  onMouseDown,
  onPositionChange,
  onSizeChange,
  resizable = true,
  movable = true,
  bodyDrag = false,
}: WindowProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width, height });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [previousSize, setPreviousSize] = useState({ width, height });
  const [previousPosition, setPreviousPosition] = useState({
    x: initialX,
    y: initialY,
  });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    startX: 0,
    startY: 0,
    direction: "se" as ResizeDirection,
  });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let newWidth = width;
    let newHeight = height;
    let newX = initialX;
    let newY = initialY;
    let needsUpdate = false;

    if (width > screenWidth) {
      newWidth = screenWidth;
      needsUpdate = true;
    }
    if (height > screenHeight) {
      newHeight = screenHeight;
      needsUpdate = true;
    }

    if (initialX + newWidth > screenWidth) {
      newX = Math.max(0, screenWidth - newWidth);
      needsUpdate = true;
    }
    if (initialY + newHeight > screenHeight) {
      newY = Math.max(0, screenHeight - newHeight);
      needsUpdate = true;
    }
    if (initialX < 0) {
      newX = 0;
      needsUpdate = true;
    }
    if (initialY < 0) {
      newY = 0;
      needsUpdate = true;
    }

    if (needsUpdate) {
      if (newWidth !== width || newHeight !== height) {
        setSize({ width: newWidth, height: newHeight });
        onSizeChange && onSizeChange(newWidth, newHeight);
      }
      if (newX !== initialX || newY !== initialY) {
        setPosition({ x: newX, y: newY });
        onPositionChange && onPositionChange(newX, newY);
      }
    }
  }, []);

  useEffect(() => {
    const handleWindowResize = () => {
      setSize((currentSize) => {
        setPosition((currentPosition) => {
          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight;

          let newWidth = currentSize.width;
          let newHeight = currentSize.height;
          let newX = currentPosition.x;
          let newY = currentPosition.y;

          if (currentSize.width > screenWidth) {
            newWidth = screenWidth;
          }
          if (currentSize.height > screenHeight) {
            newHeight = screenHeight;
          }

          if (currentPosition.x + newWidth > screenWidth) {
            newX = Math.max(0, screenWidth - newWidth);
          }
          if (currentPosition.y + newHeight > screenHeight) {
            newY = Math.max(0, screenHeight - newHeight);
          }
          if (currentPosition.x < 0) {
            newX = 0;
          }
          if (currentPosition.y < 0) {
            newY = 0;
          }

          if (newX !== currentPosition.x || newY !== currentPosition.y) {
            onPositionChange && onPositionChange(newX, newY);
            return { x: newX, y: newY };
          }
          return currentPosition;
        });

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        let newWidth = currentSize.width;
        let newHeight = currentSize.height;

        if (currentSize.width > screenWidth) {
          newWidth = screenWidth;
        }
        if (currentSize.height > screenHeight) {
          newHeight = screenHeight;
        }

        if (newWidth !== currentSize.width || newHeight !== currentSize.height) {
          onSizeChange && onSizeChange(newWidth, newHeight);
          return { width: newWidth, height: newHeight };
        }
        return currentSize;
      });
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [onPositionChange, onSizeChange]);

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (isDragging) {
        const newX = clientX - dragOffset.x;
        const newY = clientY - dragOffset.y;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const constrainedX = Math.max(
          0,
          Math.min(newX, screenWidth - size.width)
        );
        const constrainedY = Math.max(
          0,
          Math.min(newY, screenHeight - size.height)
        );

        setPosition({
          x: constrainedX,
          y: constrainedY,
        });
      }

      if (isResizing) {
        const deltaX = clientX - resizeStart.x;
        const deltaY = clientY - resizeStart.y;

        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = resizeStart.startX;
        let newY = resizeStart.startY;

        const { direction } = resizeStart;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        if (direction.includes("e")) {
          const maxWidth = screenWidth - resizeStart.startX;
          newWidth = Math.max(
            200,
            Math.min(maxWidth, resizeStart.width + deltaX)
          );
        } else if (direction.includes("w")) {
          newWidth = Math.max(200, resizeStart.width - deltaX);
          newX = resizeStart.startX + (resizeStart.width - newWidth);
          if (newX < 0) {
            newWidth = resizeStart.width + resizeStart.startX;
            newX = 0;
          }
        }

        if (direction.includes("s")) {
          const maxHeight = screenHeight - resizeStart.startY;
          newHeight = Math.max(
            150,
            Math.min(maxHeight, resizeStart.height + deltaY)
          );
        } else if (direction.includes("n")) {
          newHeight = Math.max(150, resizeStart.height - deltaY);
          newY = resizeStart.startY + (resizeStart.height - newHeight);
          if (newY < 0) {
            newHeight = resizeStart.height + resizeStart.startY;
            newY = 0;
          }
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      if (isDragging && onPositionChange) {
        onPositionChange(position.x, position.y);
      }
      if (isResizing && onSizeChange) {
        onSizeChange(size.width, size.height);
      }
      if (isResizing && onPositionChange) {
        onPositionChange(position.x, position.y);
      }

      movable && setIsDragging(false);
      setIsResizing(false);
    };

    const handleMouseUp = () => {
      handleEnd();
    };

    const handleTouchEnd = () => {
      handleEnd();
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.body.style.cursor = "default";
    };
  }, [
    isDragging,
    isResizing,
    dragOffset,
    resizeStart,
    position,
    size,
    onPositionChange,
    onSizeChange,
  ]);

  const handleTopbarMouseDown = (e: MouseEvent) => {
    if (!windowRef.current) return;

    onMouseDown && onMouseDown();

    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    movable && setIsDragging(true);
  };

  const handleTopbarTouchStart = (e: TouchEvent) => {
    if (!windowRef.current || e.touches.length === 0) return;

    onMouseDown && onMouseDown();

    const rect = windowRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });
    movable && setIsDragging(true);
  };

  const handleResizeMouseDown = (e: MouseEvent, direction: ResizeDirection) => {
    e.preventDefault();
    e.stopPropagation();

    onMouseDown && onMouseDown();

    if (!windowRef.current) return;

    const rect = windowRef.current.getBoundingClientRect();
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      startX: position.x,
      startY: position.y,
      direction,
    });
    setIsResizing(true);
  };

  const handleResizeTouchStart = (e: TouchEvent, direction: ResizeDirection) => {
    e.preventDefault();
    e.stopPropagation();

    onMouseDown && onMouseDown();

    if (!windowRef.current || e.touches.length === 0) return;

    const touch = e.touches[0];
    const rect = windowRef.current.getBoundingClientRect();
    setResizeStart({
      x: touch.clientX,
      y: touch.clientY,
      width: size.width,
      height: size.height,
      startX: position.x,
      startY: position.y,
      direction,
    });
    setIsResizing(true);
  };

  const toggleWindowFullscreen = () => {
    if (!windowRef.current) return;
    if (
      size.width === window.innerWidth &&
      size.height === window.innerHeight
    ) {
      setSize(previousSize);
      setPosition(previousPosition);
      onSizeChange && onSizeChange(previousSize.width, previousSize.height);
      onPositionChange &&
        onPositionChange(previousPosition.x, previousPosition.y);
    } else {
      setPreviousSize(size);
      setPreviousPosition(position);
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
      onSizeChange && onSizeChange(window.innerWidth, window.innerHeight);
      onPositionChange && onPositionChange(0, 0);
    }
  };

  const handleWindowMouseDown = () => {
    onMouseDown && onMouseDown();
  };

  return (
    <div
      ref={windowRef}
      class="absolute bg-base-100 rounded-box border-2 border-base-300 shadow-xl overflow-hidden window"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: stackPosition,
        visibility: minimized ? "hidden" : "visible",
        pointerEvents: minimized ? "none" : "auto",
      }}
      onMouseDown={handleWindowMouseDown}
    >
      {visibleTopbar && (
        <WindowTopbar
          title={title}
          isActive={isActive}
          onMouseDown={handleTopbarMouseDown}
          onTouchStart={handleTopbarTouchStart}
          onClose={onClose}
          onMinimize={onMinimize}
          onMaximize={onMaximize || toggleWindowFullscreen}
        />
      )}

      {bodyDrag && (
        <div
          class="absolute inset-0"
          onMouseDown={handleTopbarMouseDown}
          onTouchStart={handleTopbarTouchStart}
        />
      )}

      <div
        class="h-full overflow-auto p-0 window-inner"
        style={{ height: visibleTopbar ? "calc(100% - 48px)" : "100%" }}
      >
        {children}
      </div>

      {resizable && (
        <>
          <div
            class="absolute top-0 right-0 w-3 h-3 cursor-ne-resize  hover:bg-neutral hover:opacity-25"
            style={{
              clipPath: "circle(99% at 100% 0)",
            }}
            onMouseDown={(e) => handleResizeMouseDown(e, "ne")}
            onTouchStart={(e) => handleResizeTouchStart(e, "ne")}
          />
          <div
            class="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize  bg-neutral opacity-5 hover:opacity-25"
            style={{
              clipPath: "circle(99% at 100% 100%)",
            }}
            onMouseDown={(e) => handleResizeMouseDown(e, "se")}
            onTouchStart={(e) => handleResizeTouchStart(e, "se")}
          />
          <div
            class="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize  hover:bg-neutral hover:opacity-25"
            style={{
              clipPath: "circle(99% at 0 100%)",
            }}
            onMouseDown={(e) => handleResizeMouseDown(e, "sw")}
            onTouchStart={(e) => handleResizeTouchStart(e, "sw")}
          />
          <div
            class="absolute top-0 left-0 w-3 h-3 cursor-nw-resize  hover:bg-neutral hover:opacity-25"
            style={{
              clipPath: "circle(99% at 0 0)",
            }}
            onMouseDown={(e) => handleResizeMouseDown(e, "nw")}
            onTouchStart={(e) => handleResizeTouchStart(e, "nw")}
          />
          <div
            class="absolute right-0 top-0 bottom-0 w-1 cursor-e-resize  hover:bg-neutral hover:opacity-25"
            onMouseDown={(e) => handleResizeMouseDown(e, "e")}
            onTouchStart={(e) => handleResizeTouchStart(e, "e")}
          />
          <div
            class="absolute left-0 top-0 bottom-0 w-1 cursor-w-resize  hover:bg-neutral hover:opacity-25"
            onMouseDown={(e) => handleResizeMouseDown(e, "w")}
            onTouchStart={(e) => handleResizeTouchStart(e, "w")}
          />
          <div
            class="absolute top-0 left-0 right-0 h-1 cursor-n-resize  hover:bg-neutral hover:opacity-25"
            onMouseDown={(e) => handleResizeMouseDown(e, "n")}
            onTouchStart={(e) => handleResizeTouchStart(e, "n")}
          />
          <div
            class="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize  hover:bg-neutral hover:opacity-25"
            onMouseDown={(e) => handleResizeMouseDown(e, "s")}
            onTouchStart={(e) => handleResizeTouchStart(e, "s")}
          />
        </>
      )}
    </div>
  );
}
