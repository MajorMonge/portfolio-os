import { h } from 'preact';

interface TaskbarProps {
  position?: 'left' | 'right' | 'bottom' | 'top';
}

export default function Taskbar({ position = 'bottom' }: TaskbarProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'top-0 left-1/2 transform -translate-x-1/2 h-15';
      case 'left':
        return 'left-0 top-1/2 transform -translate-y-1/2 flex-col h-auto w-15';
      case 'right':
        return 'right-0 top-1/2 transform -translate-y-1/2 flex-col h-auto w-15';
      case 'bottom':
        return 'bottom-0 left-1/2 transform -translate-x-1/2 h-15';
      default:
        return 'bottom-0 left-1/2 transform -translate-x-1/2 h-15';
    }
  };

  return (
    <div class={`absolute ${getPositionClasses()} z-[999] flex gap-2 items-center bg-base-200 rounded-box justify-between mx-4 my-2 px-4 border-2 border-base-100 shadow-[1px_0px_30px_-15px_rgba(0,0,0,0.75)] w-auto panel toolbar`}>
  
    </div>
  );
}
