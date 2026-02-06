
import React, { useState, useEffect } from 'react';
import { WindowState, AppId } from '../types';

interface TaskbarProps {
  windows: WindowState[];
  onStartClick: () => void;
  onWindowToggle: (id: string) => void;
  onVolumeClick?: () => void;
  onOpenApp?: (appId: AppId, title: string, icon: string) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ windows, onStartClick, onWindowToggle, onOpenApp }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-[30px] xp-taskbar-gradient flex items-center z-[99999] shadow-[0_-2px_5px_rgba(0,0,0,0.3)] select-none">
      {/* Start Button */}
      <button
        onClick={(e) => { e.stopPropagation(); onStartClick(); }}
        className="xp-start-button-gradient h-full px-3 flex items-center gap-1.5 rounded-r-xl border-r border-green-900 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.3)] group active:brightness-90 transition-all overflow-hidden touch-none"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Windows_XP_Logo.svg"
          alt="Start"
          className="w-5 h-5 drop-shadow-sm"
        />
        <span className="text-white font-bold italic text-lg drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)] pb-0.5 pr-1">start</span>
      </button>

      {/* Task Buttons */}
      <div className="flex-1 h-full flex items-center px-2 gap-1 overflow-x-auto no-scrollbar">
        {windows.filter(w => w.isOpen).map(win => (
          <button
            key={win.id}
            onClick={() => onWindowToggle(win.id)}
            className={`flex items-center gap-2 px-3 h-[24px] rounded-sm text-[11px] min-w-[100px] max-w-[160px] truncate transition-colors ${
              !win.isMinimized && win.zIndex === Math.max(...windows.map(w => w.zIndex))
                ? 'bg-[#1e52b7] text-white border border-black/30 shadow-inner'
                : 'bg-[#3b8cf8] text-white/90 border-r border-black/20 hover:bg-[#4ea0ff]'
            }`}
          >
            <img src={win.icon} alt="" className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{win.title}</span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="h-full px-3 bg-[#0997ff] border-l border-[#0052e1] shadow-inner flex items-center gap-2">
        <div className="flex gap-2 items-center">
          <button 
            onClick={() => onOpenApp?.(AppId.VOLUME_CONTROL, 'Controle de Volume', 'https://win98icons.alexmeub.com/icons/png/loudspeaker_rays-0.png')} 
            className="hover:brightness-110 active:scale-95 transition-transform"
          >
             <img src="https://win98icons.alexmeub.com/icons/png/loudspeaker_rays-0.png" className="w-3.5 h-3.5" alt="Volume" />
          </button>
          <img src="https://win98icons.alexmeub.com/icons/png/network_normal_two_pcs-0.png" className="w-4 h-4 opacity-80" alt="" />
        </div>
        <span className="text-white text-[11px] font-medium min-w-[45px] text-center">
          {formatTime(time)}
        </span>
      </div>
    </div>
  );
};
