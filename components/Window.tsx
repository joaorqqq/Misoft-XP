
import React, { useState, useRef, useEffect } from 'react';
import { WindowState } from '../types';

interface WindowProps {
  window: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onUpdate: (updates: Partial<WindowState>) => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  window: win,
  onClose,
  onMinimize,
  onFocus,
  onUpdate,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleHeaderPointerDown = (e: React.PointerEvent) => {
    if (win.isMaximized) return;
    onFocus();
    
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);

    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - win.x,
      y: e.clientY - win.y
    };
  };

  const handleHeaderPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    let newX = e.clientX - dragOffset.current.x;
    let newY = e.clientY - dragOffset.current.y;

    // CLAMPING: Impedir que a janela saia da tela
    const padding = 10;
    const windowWidth = typeof win.width === 'number' ? win.width : 600;
    const windowHeight = typeof win.height === 'number' ? win.height : 450;
    
    newX = Math.max(-windowWidth + 100, Math.min(newX, window.innerWidth - 100));
    newY = Math.max(0, Math.min(newY, window.innerHeight - 40));

    onUpdate({ x: newX, y: newY });
  };

  const handleHeaderPointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      const el = e.currentTarget as HTMLElement;
      el.releasePointerCapture(e.pointerId);
    }
  };

  if (win.isMinimized) return null;

  const style: React.CSSProperties = win.isMaximized
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 30px)', zIndex: win.zIndex }
    : { top: win.y, left: win.x, width: win.width, height: win.height, zIndex: win.zIndex };

  return (
    <div
      className={`absolute flex flex-col bg-[#ece9d8] border-[3px] border-[#0053e1] rounded-t-lg xp-window-shadow overflow-hidden select-none touch-none`}
      style={style}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div
        className="xp-titlebar xp-blue-gradient cursor-default flex justify-between items-center"
        onPointerDown={handleHeaderPointerDown}
        onPointerMove={handleHeaderPointerMove}
        onPointerUp={handleHeaderPointerUp}
        onDoubleClick={() => onUpdate({ isMaximized: !win.isMaximized })}
      >
        <div className="flex items-center gap-2 pointer-events-none">
          <img src={win.icon} alt="" className="w-4 h-4" />
          <span className="text-[13px]">{win.title}</span>
        </div>
        <div className="flex gap-1 items-center pr-1">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="xp-button-sys w-5 h-5 flex items-center justify-center font-bold text-white text-[10px] pb-2 rounded hover:brightness-110"
          >
            _
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onUpdate({ isMaximized: !win.isMaximized }); }}
            className="xp-button-sys w-5 h-5 flex items-center justify-center font-bold text-white text-[12px] pb-0.5 rounded hover:brightness-110"
          >
            {win.isMaximized ? '❐' : '□'}
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="xp-button-close w-5 h-5 flex items-center justify-center font-bold text-white text-[12px] pb-0.5 rounded hover:brightness-110"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white xp-scrollbar relative">
        {children}
      </div>
    </div>
  );
};
