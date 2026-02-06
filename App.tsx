
import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import { VirtualKeyboard } from './apps/VirtualKeyboard';
import { Calculator } from './apps/Calculator';
import { CommandPrompt } from './apps/CommandPrompt';
import { playSound, XP_SOUNDS, unlockAudio } from './utils/sounds';

const INITIAL_DESKTOP: DesktopItem[] = DESKTOP_ICONS.map(i => ({
  id: 'initial-' + i.id,
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

  // Garante a remoção do loader
  useEffect(() => {
    const loader = document.getElementById('root-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => { loader.style.display = 'none'; }, 500);
    }
  }, []);

  const handleLogin = useCallback((username: string, wasAdminCode?: boolean) => {
    setIsAuthenticated(true);
    setCurrentUser({
      username: username,
      password: '',
      avatar: 'https://picsum.photos/seed/' + username + '/64',
      isAdmin: wasAdminCode || false
    });
    unlockAudio();
    playSound(XP_SOUNDS.STARTUP);
  }, []);

  const focusWin = useCallback((id: string) => {
    setWindows(prev => {
      const newZ = maxZ + 1;
      setMaxZ(newZ);
      return prev.map(w => w.id === id ? { ...w, zIndex: newZ, isMinimized: false, isOpen: true } : w);
    });
  }, [maxZ]);

  const openApp = useCallback((appId: AppId, title: string, icon: string, data?: any) => {
    const winId = appId === AppId.FOLDER ? 'folder-' + title : 'app-' + appId;
    
    setWindows(prev => {
      const existing = prev.find(w => w.id === winId);
      const newZ = maxZ + 1;
      setMaxZ(newZ);

      if (existing) {
        return prev.map(w => w.id === winId ? { ...w, isOpen: true, isMinimized: false, zIndex: newZ } : w);
      }
      
      const isTV = window.innerWidth <= 1920;
      const newWin: WindowState = {
        id: winId, appId: appId, title: title, icon: icon,
        isOpen: true, isMinimized: false,
        isMaximized: isTV && appId !== AppId.OSK && appId !== AppId.CALCULATOR,
        zIndex: newZ,
        x: isTV ? 0 : 50 + (prev.length * 20),
        y: isTV ? 0 : 50 + (prev.length * 20),
        width: isTV ? '100%' : 700,
        height: isTV ? 'calc(100% - 30px)' : 500,
        data: data
      };
      return [...prev, newWin];
    });
    
    playSound(XP_SOUNDS.OPEN);
    setIsStartOpen(false);
  }, [maxZ]);

  const renderContent = (win: WindowState) => {
    switch (win.appId) {
      case AppId.INTERNET_EXPLORER: return <InternetExplorer />;
      case AppId.NOTEPAD: return <Notepad />;
      case AppId.PAINT: return <Paint />;
      case AppId.MSN_MESSENGER: return <MSNMessenger />;
      case AppId.MEDIA_PLAYER: return <MediaPlayer />;
      case AppId.OSK: return <VirtualKeyboard />;
      case AppId.CALCULATOR: return <Calculator />;
      case AppId.CMD: return <CommandPrompt />;
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

  const restartSystem = () => {
    setIsCrashed(false);
    setWindows([]);
    setIsAuthenticated(false);
    window.location.reload();
  };

  if (isCrashed) return <BSOD onRestart={restartSystem} onEasterEgg={() => {}} />;
  if (!isAuthenticated) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div
      className="w-full h-screen relative bg-cover bg-center overflow-hidden touch-none flex flex-col select-none"
      style={{ backgroundImage: 'url(' + WALLPAPER_URL + ')' }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedItemIds(new Set());
          setIsStartOpen(false);
        }
      }}
    >
      <div className="flex-1 relative z-0 p-4">
        {desktopItems.map(i => (
          <DesktopIcon 
            key={i.id} id={i.id} label={i.label} icon={i.icon}
            gridX={i.gridX} gridY={i.gridY}
            onOpen={() => openApp(i.appId, i.label, i.icon, i.items)} 
            onMove={(id, x, y) => setDesktopItems(prev => prev.map(item => item.id === id ? { ...item, gridX: x, gridY: y } : item))}
            isSelected={selectedItemIds.has(i.id)}
          />
        ))}
        
        {windows.map(win => win.isOpen && (
          <Window
            key={win.id} window={win}
            onClose={() => setWindows(prev => prev.map(w => w.id === win.id ? { ...w, isOpen: false } : w))}
            onMinimize={() => setWindows(prev => {
              const target = prev.find(w => w.id === win.id);
              if (target && target.isMinimized) {
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
        onOpenApp={(appId, title, icon) => openApp(appId, title, icon)}
        onWindowToggle={(id) => {
          const win = windows.find(w => w.id === id);
          if (win && (win.isMinimized || win.zIndex !== Math.max(...windows.map(w => w.zIndex)))) {
            focusWin(id);
          } else {
            setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
          }
        }} 
      />
    </div>
  );
};

export default App;
