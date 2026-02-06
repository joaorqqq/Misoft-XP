
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { WindowState, AppId, DesktopItem, User } from './types';
import { DESKTOP_ICONS, WALLPAPER_URL } from './components/constants';
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
import { LoginScreen } from './components/LoginScreen';
import { Credits } from './apps/Credits';
import { playSound, XP_SOUNDS, unlockAudio } from './utils/sounds';

const INITIAL_DESKTOP: DesktopItem[] = DESKTOP_ICONS.map(i => ({
  id: `initial-${i.id}`,
  appId: i.id,
  label: i.label,
  icon: i.icon,
  gridX: i.gridX,
  gridY: i.gridY
}));

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>(INITIAL_DESKTOP);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [maxZ, setMaxZ] = useState(100);
  const [isCrashed, setIsCrashed] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

  const focusWin = useCallback((id: string) => {
    setWindows(prev => {
      const newZ = maxZ + 1;
      setMaxZ(newZ);
      return prev.map(w => w.id === id ? { ...w, zIndex: newZ, isMinimized: false, isOpen: true } : w);
    });
  }, [maxZ]);

  const openApp = useCallback((appId: AppId, title: string, icon: string, data?: any) => {
    const winId = appId === AppId.FOLDER ? `folder-${JSON.stringify(data || '').length}-${title}` : `app-${appId}`;
    
    setWindows(prev => {
      const existingIndex = prev.findIndex(w => w.id === winId);
      const newZ = maxZ + 1;
      setMaxZ(newZ);

      if (existingIndex !== -1) {
        // Se a janela já existe (mesmo se foi fechada), reabre e traz para frente
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          isOpen: true,
          isMinimized: false,
          zIndex: newZ
        };
        return updated;
      }
      
      const newWin: WindowState = {
        id: winId,
        appId,
        title,
        icon,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: newZ,
        x: 100 + (prev.length * 20),
        y: 100 + (prev.length * 20),
        width: appId === AppId.INTERNET_EXPLORER ? '90%' : appId === AppId.CREDITS ? 450 : 600,
        height: appId === AppId.INTERNET_EXPLORER ? '85%' : appId === AppId.CREDITS ? 500 : 450,
        data
      };
      
      return [...prev, newWin];
    });
    
    playSound(XP_SOUNDS.OPEN);
    setIsStartOpen(false);
  }, [maxZ]);

  const onMoveItem = useCallback((id: string, gridX: number, gridY: number) => {
    setDesktopItems(prev => {
      const itemToMove = prev.find(i => i.id === id);
      if (!itemToMove) return prev;
      return prev.map(i => i.id === id ? { ...i, gridX, gridY } : i);
    });
  }, []);

  const handleLogin = (username: string, wasAdminCode?: boolean) => {
    setCurrentUser({ 
      username, 
      password: '', 
      avatar: `https://picsum.photos/seed/${username}/64`, 
      isAdmin: !!wasAdminCode 
    });
    setIsAuthenticated(true);
  };

  const renderContent = (win: WindowState) => {
    switch (win.appId) {
      case AppId.INTERNET_EXPLORER: return <InternetExplorer />;
      case AppId.NOTEPAD: return <Notepad />;
      case AppId.PAINT: return <Paint />;
      case AppId.MSN_MESSENGER: return <MSNMessenger />;
      case AppId.MEDIA_PLAYER: return <MediaPlayer />;
      case AppId.CREDITS: return <Credits />;
      case AppId.FOLDER: 
      case AppId.DOCUMENTS: 
      case AppId.MY_COMPUTER: 
      case AppId.RECYCLE_BIN:
        return <Explorer 
          title={win.title} 
          type={win.appId}
          items={win.data} 
          onOpenApp={(item) => openApp(item.appId, item.label, item.icon, item.items)} 
        />;
      default: return <div className="p-8 text-center text-gray-500 italic">Aplicação indisponível.</div>;
    }
  };

  if (isCrashed) return <BSOD onRestart={() => setIsCrashed(false)} onEasterEgg={() => {}} />;
  if (!isAuthenticated) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div
      className="w-full h-screen relative bg-cover bg-center overflow-hidden touch-none flex flex-col select-none"
      style={{ backgroundImage: `url(${WALLPAPER_URL})` }}
      onPointerDown={() => {
        setSelectedItemIds(new Set());
        setIsStartOpen(false);
        unlockAudio();
      }}
    >
      <div className="flex-1 relative z-0">
        {desktopItems.map(i => (
          <DesktopIcon 
            key={i.id} id={i.id} label={i.label} icon={i.icon}
            gridX={i.gridX} gridY={i.gridY}
            onOpen={() => openApp(i.appId, i.label, i.icon, i.items)} 
            onMove={onMoveItem} 
            isSelected={selectedItemIds.has(i.id)}
          />
        ))}
        
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
        isAdmin={currentUser?.isAdmin}
        onOpenApp={(appId) => {
          const iconData = DESKTOP_ICONS.find(d => d.id === appId) || { label: appId, icon: '' };
          openApp(appId, iconData.label, iconData.icon);
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
