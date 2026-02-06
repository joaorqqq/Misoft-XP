
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { WindowState, AppId, DesktopItem } from './types';
import { DESKTOP_ICONS, WALLPAPER_URL } from './constants';
import { DesktopIcon } from './components/DesktopIcon';
import { Window } from './components/Window';
import { Taskbar } from './components/Taskbar';
import { StartMenu } from './components/StartMenu';
import { InternetExplorer } from './apps/InternetExplorer';
import { Notepad } from './apps/Notepad';
import { Paint } from './apps/Paint';
import { Explorer } from './apps/Explorer';
import { MSNMessenger } from './apps/MSNMessenger';
import { MediaPlayer } from './apps/MediaPlayer';
import { BSOD } from './components/BSOD';

const INITIAL_DESKTOP: DesktopItem[] = DESKTOP_ICONS.map(i => ({
  id: `initial-${i.id}`,
  appId: i.id,
  label: i.label,
  icon: i.icon,
  gridX: i.gridX,
  gridY: i.gridY
}));

const App: React.FC = () => {
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>(INITIAL_DESKTOP);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [maxZ, setMaxZ] = useState(100);
  const [isCrashed, setIsCrashed] = useState(false);

  // Selection Rectangle State
  const [selection, setSelection] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

  const focusWin = useCallback((id: string) => {
    setWindows(prev => {
      const newZ = maxZ + 1;
      setMaxZ(newZ);
      return prev.map(w => w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w);
    });
  }, [maxZ]);

  const openApp = useCallback((appId: AppId, title: string, icon: string, data?: any) => {
    const id = appId === AppId.FOLDER ? `folder-${JSON.stringify(data || '').length}-${title}` : `app-${appId}`;
    
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        focusWin(id);
        return prev;
      }
      
      const newZ = maxZ + 1;
      setMaxZ(newZ);
      
      const newWin: WindowState = {
        id,
        appId,
        title,
        icon,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: newZ,
        x: 100 + (prev.length * 20),
        y: 100 + (prev.length * 20),
        width: appId === AppId.INTERNET_EXPLORER ? '90%' : 600,
        height: appId === AppId.INTERNET_EXPLORER ? '85%' : 450,
        data
      };
      
      return [...prev, newWin];
    });
    setIsStartOpen(false);
  }, [focusWin, maxZ]);

  const onMoveItem = useCallback((id: string, gridX: number, gridY: number) => {
    setDesktopItems(prev => {
      const itemToMove = prev.find(i => i.id === id);
      if (!itemToMove) return prev;
      const targetItem = prev.find(i => i.gridX === gridX && i.gridY === gridY && i.id !== id);
      
      if (targetItem) {
        const folderId = targetItem.appId === AppId.FOLDER ? targetItem.id : `folder-${Date.now()}`;
        const existingItems = targetItem.appId === AppId.FOLDER ? (targetItem.items || []) : [targetItem];
        if (itemToMove.appId === AppId.FOLDER) return prev.map(i => i.id === id ? { ...i, gridX, gridY } : i);
        const newFolder: DesktopItem = {
          id: folderId, appId: AppId.FOLDER,
          label: targetItem.appId === AppId.FOLDER ? targetItem.label : 'New Folder',
          icon: 'https://win98icons.alexmeub.com/icons/png/directory_closed-4.png',
          gridX, gridY, items: [...existingItems, itemToMove]
        };
        return prev.filter(i => i.id !== id && i.id !== targetItem.id).concat(newFolder);
      }
      return prev.map(i => i.id === id ? { ...i, gridX, gridY } : i);
    });
  }, []);

  const onWallpaperPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    setSelection({ startX: e.clientX, startY: e.clientY, endX: e.clientX, endY: e.clientY });
    setSelectedItemIds(new Set());
    setIsStartOpen(false);
  };

  const onWallpaperPointerMove = (e: React.PointerEvent) => {
    if (!selection) return;
    setSelection(prev => prev ? { ...prev, endX: e.clientX, endY: e.clientY } : null);
    
    const rectX = Math.min(selection.startX, e.clientX);
    const rectY = Math.min(selection.startY, e.clientY);
    const rectW = Math.abs(selection.startX - e.clientX);
    const rectH = Math.abs(selection.startY - e.clientY);
    const selected = new Set<string>();
    const GRID_W = 85; const GRID_H = 100;
    
    desktopItems.forEach(item => {
      const itemX = item.gridX * GRID_W + 15;
      const itemY = item.gridY * GRID_H + 15;
      if (rectX < itemX + 80 && rectX + rectW > itemX && rectY < itemY + 95 && rectY + rectH > itemY) {
        selected.add(item.id);
      }
    });
    setSelectedItemIds(selected);
  };

  const onWallpaperPointerUp = () => setSelection(null);

  const restartSystem = () => {
    setIsCrashed(false);
    setWindows([]);
    setDesktopItems(INITIAL_DESKTOP);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.altKey && e.key === 'b') setIsCrashed(true);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const renderContent = (win: WindowState) => {
    switch (win.appId) {
      case AppId.INTERNET_EXPLORER: return <InternetExplorer />;
      case AppId.NOTEPAD: return <Notepad />;
      case AppId.PAINT: return <Paint />;
      case AppId.MSN_MESSENGER: return <MSNMessenger />;
      case AppId.MEDIA_PLAYER: return <MediaPlayer />;
      case AppId.FOLDER: 
      case AppId.DOCUMENTS: 
      case AppId.MY_COMPUTER: 
      case AppId.RECYCLE_BIN:
        return <Explorer 
          title={win.title} 
          items={win.data} 
          onOpenApp={(item) => openApp(item.appId, item.label, item.icon, item.items)} 
        />;
      default: return <div className="p-8 text-center text-gray-500 italic">This application is currently unavailable.</div>;
    }
  };

  if (isCrashed) return <BSOD onRestart={restartSystem} />;

  return (
    <div
      className="w-full h-screen relative bg-cover bg-center overflow-hidden touch-none flex flex-col select-none"
      style={{ backgroundImage: `url(${WALLPAPER_URL})` }}
      onPointerDown={onWallpaperPointerDown}
      onPointerMove={onWallpaperPointerMove}
      onPointerUp={onWallpaperPointerUp}
    >
      {/* Selection Rectangle */}
      {selection && (
        <div 
          className="absolute border border-blue-400 bg-blue-400/20 z-[5000] pointer-events-none"
          style={{
            left: Math.min(selection.startX, selection.endX),
            top: Math.min(selection.startY, selection.endY),
            width: Math.abs(selection.startX - selection.endX),
            height: Math.abs(selection.startY - selection.endY)
          }}
        />
      )}

      {/* Desktop Items */}
      <div className="flex-1 relative z-0">
        {desktopItems.map(i => (
          <DesktopIcon 
            key={i.id} id={i.id} label={i.label} icon={i.icon}
            initialGridX={i.gridX} initialGridY={i.gridY}
            onOpen={() => openApp(i.appId, i.label, i.icon, i.items)} 
            onMove={onMoveItem} isSelected={selectedItemIds.has(i.id)}
          />
        ))}
        
        {/* Windows Rendering Layer */}
        {windows.map(win => win.isOpen && (
          <Window
            key={win.id} window={win}
            onClose={() => setWindows(prev => prev.map(w => w.id === win.id ? { ...w, isOpen: false } : w))}
            onMinimize={() => setWindows(prev => {
              const target = prev.find(w => w.id === win.id);
              if (target?.isMinimized) {
                const newZ = maxZ + 1; setMaxZ(newZ);
                return prev.map(w => w.id === win.id ? { ...w, isMinimized: false, zIndex: newZ } : w);
              }
              return prev.map(w => w.id === win.id ? { ...w, isMinimized: true } : w);
            })}
            onFocus={() => focusWin(win.id)}
            onUpdate={u => setWindows(prev => prev.map(w => w.id === win.id ? { ...w, ...u } : w))}
          >
            {renderContent(win)}
          </Window>
        ))}
      </div>

      <StartMenu 
        isOpen={isStartOpen} 
        onOpenApp={(appId) => {
          const iconData = DESKTOP_ICONS.find(d => d.id === appId);
          openApp(appId, iconData?.label || appId, iconData?.icon || '');
        }} 
        onClose={() => setIsStartOpen(false)} 
      />
      
      <Taskbar 
        windows={windows} 
        onStartClick={() => setIsStartOpen(!isStartOpen)} 
        onWindowToggle={(id) => {
          const win = windows.find(w => w.id === id);
          if (win?.isMinimized || (win && win.zIndex !== Math.max(...windows.map(w => w.zIndex)))) {
            focusWin(id as string);
          } else {
            setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
          }
        }} 
      />
    </div>
  );
};

export default App;
