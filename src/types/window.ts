export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface WindowState {
  position: Position;
  size: Size;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface DragState {
  isDragging: boolean;
  offset: Position;
}

export interface ResizeState {
  isResizing: boolean;
  startPosition: Position;
  startSize: Size;
}
