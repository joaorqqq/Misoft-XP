
import React, { useState, useRef, useEffect } from 'react';
import { XP_SOUNDS, playSound } from '../utils/sounds';

interface DesktopIconProps {
  id: string;
  label: string;
  icon: string;
  gridX: number;
  gridY: number;
  onOpen: () => void;
  onMove: (id: string, gridX: number, gridY: number) => void;
  isSelected?: boolean;
}

const GRID_W = 85;
const GRID_H = 100;
const OFFSET_X = 15;
const OFFSET_Y = 15;

export const DesktopIcon: React.FC<DesktopIconProps> = ({ 
  id, label, icon, gridX, gridY, onOpen, onMove, isSelected 
}) => {
  const [pos, setPos] = useState({ 
    x: gridX * GRID_W + OFFSET_X, 
    y: gridY * GRID_H + OFFSET_Y 
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastClick = useRef(0);

  useEffect(() => {
    if (!isDragging) {
      setPos({ 
        x: gridX * GRID_W + OFFSET_X, 
        y: gridY * GRID_H + OFFSET_Y 
      });
    }
  }, [gridX, gridY, isDragging]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation(); // Impede de desselecionar ao clicar no próprio ícone

    const now = Date.now();
    const isDoubleClick = (now - lastClick.current < 400); 
    lastClick.current = now;

    if (isDoubleClick) {
      playSound(XP_SOUNDS.CLICK);
      onOpen();
      setIsDragging(false);
      return;
    }

    // Seleção visual imediata e preparação para arraste
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    
    const clampedX = Math.max(0, Math.min(newX, window.innerWidth - 80));
    const clampedY = Math.max(0, Math.min(newY, window.innerHeight - 130));

    setPos({ x: clampedX, y: clampedY });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    
    const targetGridX = Math.round((pos.x - OFFSET_X) / GRID_W);
    const targetGridY = Math.round((pos.y - OFFSET_Y) / GRID_H);
    
    onMove(id, targetGridX, targetGridY);
  };

  return (
    <div
      className={`absolute flex flex-col items-center justify-start p-1 w-[80px] h-[95px] rounded select-none cursor-default touch-none group ${
        isDragging ? 'z-[9999] opacity-70' : 'z-10'
      } ${isSelected || isDragging ? 'bg-[#0a246a]/30 ring-1 ring-white/20' : 'hover:bg-white/10'}`}
      style={{ left: pos.x, top: pos.y }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="w-11 h-11 relative flex items-center justify-center mb-1 pointer-events-none">
        <img
          src={icon}
          alt=""
          className={`w-10 h-10 drop-shadow-md ${isSelected ? 'brightness-75' : ''}`}
          onError={(e) => (e.currentTarget.src = 'https://win98icons.alexmeub.com/icons/png/file_windows-0.png')}
        />
      </div>
      <span className="text-white text-[11px] xp-icon-text text-center leading-tight drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)] px-1 break-words line-clamp-2 overflow-hidden pointer-events-none">
        {label}
      </span>
    </div>
  );
};
