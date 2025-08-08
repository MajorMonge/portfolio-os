import { h, type JSX } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import WindowTopbar from '../WindowTopbar';

interface WindowProps {
  title: string | JSX.Element;
  visibleTopbar?: boolean;
  children?: any;
  initialX?: number;
  initialY?: number;
  width?: number;
  height?: number;
  stackPosition?: number;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  resizable?: boolean;
  movable?: boolean;
  bodyDrag?: boolean;
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export default function Window({
  title,
  children,
  visibleTopbar = true,
  initialX = 100,
  initialY = 100,
  width = 400,
  height = 300,
  stackPosition = 500,
  onClose,
  onMinimize,
  onMaximize,
  resizable = true,
  movable = true,
  bodyDrag = false
}: WindowProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width, height });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [previousSize, setPreviousSize] = useState({ width, height });
  const [previousPosition, setPreviousPosition] = useState({ x: initialX, y: initialY });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    startX: 0,
    startY: 0,
    direction: 'se' as ResizeDirection
  });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        const constrainedX = Math.max(0, Math.min(newX, screenWidth - size.width));
        const constrainedY = Math.max(0, Math.min(newY, screenHeight - size.height));
        
        setPosition({
          x: constrainedX,
          y: constrainedY
        });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = resizeStart.startX;
        let newY = resizeStart.startY;

        const { direction } = resizeStart;

        // Get screen dimensions
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        if (direction.includes('e')) {
          // Limit width to not exceed screen boundary
          const maxWidth = screenWidth - resizeStart.startX;
          newWidth = Math.max(200, Math.min(maxWidth, resizeStart.width + deltaX));
        } else if (direction.includes('w')) {
          newWidth = Math.max(200, resizeStart.width - deltaX);
          newX = resizeStart.startX + (resizeStart.width - newWidth);
          // Ensure window doesn't go beyond left edge
          if (newX < 0) {
            newWidth = resizeStart.width + resizeStart.startX;
            newX = 0;
          }
        }

        if (direction.includes('s')) {
          // Limit height to not exceed screen boundary
          const maxHeight = screenHeight - resizeStart.startY;
          newHeight = Math.max(150, Math.min(maxHeight, resizeStart.height + deltaY));
        } else if (direction.includes('n')) {
          newHeight = Math.max(150, resizeStart.height - deltaY);
          newY = resizeStart.startY + (resizeStart.height - newHeight);
          // Ensure window doesn't go beyond top edge
          if (newY < 0) {
            newHeight = resizeStart.height + resizeStart.startY;
            newY = 0;
          }
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      movable && setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isDragging, isResizing, dragOffset, resizeStart]);

  const handleTopbarMouseDown = (e: MouseEvent) => {
    if (!windowRef.current) return;

    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    movable && setIsDragging(true);
  };

  const handleResizeMouseDown = (e: MouseEvent, direction: ResizeDirection) => {
    e.preventDefault();
    e.stopPropagation();

    if (!windowRef.current) return;

    const rect = windowRef.current.getBoundingClientRect();
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      startX: position.x,
      startY: position.y,
      direction
    });
    setIsResizing(true);
  };

  const toggleWindowFullscreen = () => {
    console.log("Toggling fullscreen");
    if (!windowRef.current) return;
    if (size.width === window.innerWidth && size.height === window.innerHeight) {
      setSize(previousSize);
      setPosition(previousPosition);
    } else {
      setPreviousSize(size);
      setPreviousPosition(position);
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
    }
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
        zIndex: stackPosition
      }}
    >
      {visibleTopbar && (
        <WindowTopbar
          title={title}
          onMouseDown={handleTopbarMouseDown}
          onClose={onClose}
          onMinimize={onMinimize}
          onMaximize={onMaximize || toggleWindowFullscreen}
        />
      )}
      
      {
        bodyDrag && (
          <div
            class="absolute inset-0"
            onMouseDown={handleTopbarMouseDown}
          />
        )
      }

      <div class="h-full overflow-auto p-0 window-inner" style={{ height: 'calc(100%)' }}>
        {children}
      </div>

      {resizable && (
        <>
          <div
            class="absolute top-0 right-0 w-3 h-3 cursor-ne-resize  hover:bg-neutral hover:opacity-25"
            style={{
              clipPath: 'circle(99% at 100% 0)'
            }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
          />
          <div
            class="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize  bg-neutral opacity-5 hover:opacity-25"
            style={{
              clipPath: 'circle(99% at 100% 100%)'
            }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
          />
          <div
            class="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize  hover:bg-neutral hover:opacity-25"
            style={{
              clipPath: 'circle(99% at 0 100%)'
            }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
          />
          <div
            class="absolute top-0 left-0 w-3 h-3 cursor-nw-resize  hover:bg-neutral hover:opacity-25"
            style={{
              clipPath: 'circle(99% at 0 0)'
            }}
            onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
          />
          <div
            class="absolute right-0 top-0 bottom-0 w-1 cursor-e-resize  hover:bg-neutral hover:opacity-25"
            onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
          />
          <div
            class="absolute left-0 top-0 bottom-0 w-1 cursor-w-resize  hover:bg-neutral hover:opacity-25"
            onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
          />
          <div
            class="absolute top-0 left-0 right-0 h-1 cursor-n-resize  hover:bg-neutral hover:opacity-25"
            onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
          />
          <div
            class="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize  hover:bg-neutral hover:opacity-25"
            onMouseDown={(e) => handleResizeMouseDown(e, 's')}
          />
        </>
      )}
    </div>
  );
}
