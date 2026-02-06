
import React, { useState, useCallback, useEffect } from 'react';
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
import { VirtualKeyboard } from './apps/VirtualKeyboard';
import { Calculator } from './apps/Calculator';
import { CommandPrompt } from './apps/CommandPrompt';
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
  const [showBrokenLines, setShowBrokenLines] = useState(false);

  // Remove o loader do HTML assim que o componente monta
  useEffect(() => {
    const loader = document.getElementById('root-loader');
    if (loader) loader.style.display = 'none';
  }, []);

  const handleLogin = useCallback((username: string, wasAdminCode?: boolean) => {
    setIsAuthenticated(true);
    setCurrentUser({
      username,
      password: '',
      avatar: `https://picsum.photos/seed/${username}/64`,
      isAdmin: wasAdminCode
    });
  }, []);

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
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          isOpen: true,
          isMinimized: false,
          zIndex: newZ
        };
        return updated;
      }
      
      const isMobile = window.innerWidth < 1024; // TVs e dispositivos menores usam modo adaptativo
      const isOSK = appId === AppId.OSK;

      const newWin: WindowState = {
        id: winId,
        appId,
        title,
        icon,
        isOpen: true,
        isMinimized: false,
        isMaximized: isMobile && !isOSK, 
        zIndex: newZ,
        x: isMobile ? 0 : 50 + (prev.length * 30),
        y: isMobile ? 0 : 50 + (prev.length * 30),
        width: isOSK ? (isMobile ? '100%' : 500) : (isMobile ? '100%' : 700),
        height: isOSK ? (isMobile ? 220 : 250) : (isMobile ? 'calc(100% - 30px)' : 500),
        data
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
      case AppId.CREDITS: return <Credits />;
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
      default: return <div className="p-8 text-center text-gray-500 italic">Aplicação em desenvolvimento.</div>;
    }
  };

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'l') {
        setShowBrokenLines(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, []);

  if (isCrashed) return <BSOD onRestart={() => setIsCrashed(false)} onEasterEgg={() => {}} />;
  if (!isAuthenticated) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div
      className="w-full h-screen relative bg-cover bg-center overflow-hidden touch-none flex flex-col select-none"
      style={{ backgroundImage: `url(${WALLPAPER_URL})` }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) {
           setSelectedItemIds(new Set());
           setIsStartOpen(false);
        }
        unlockAudio();
      }}
    >
      {/* Overlay de Linhas da TV (Conforme a Foto) */}
      {showBrokenLines && (
        <div className="absolute inset-0 pointer-events-none z-[999999] opacity-80">
          <div className="absolute top-0 bottom-0 left-[20%] w-[4px] bg-black shadow-[0_0_10px_black]"></div>
          <div className="absolute top-0 bottom-0 left-[21%] w-[1px] bg-black/40"></div>
          <div className="absolute top-0 bottom-0 left-[21.5%] w-[1px] bg-gray-900/50"></div>
          <div className="absolute top-0 bottom-0 left-[35%] w-[2px] bg-black/80"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%]"></div>
        </div>
      )}

      {/* Botão flutuante "Atualizar" estilo TV */}
      <div className="absolute top-4 right-4 z-[500] flex flex-col items-end pointer-events-none sm:pointer-events-auto">
         <div className="bg-[#00bcd4] text-white px-4 py-1.5 rounded-sm text-sm font-bold shadow-lg animate-bounce flex items-center gap-2">
            <span>Atuliazar</span>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#00bcd4] absolute -bottom-2 right-4"></div>
         </div>
      </div>

      <div className="flex-1 relative z-0 p-2 sm:p-4 overflow-hidden">
        {/* Desktop Icons com grid auto-ajustável para TVs */}
        <div className="grid grid-flow-col grid-rows-[repeat(auto-fill,90px)] sm:grid-rows-[repeat(auto-fill,105px)] gap-1 sm:gap-2 h-full content-start justify-start overflow-hidden">
          {desktopItems.map(i => (
            <DesktopIcon 
              key={i.id} id={i.id} label={i.label} icon={i.icon}
              gridX={i.gridX} gridY={i.gridY}
              onOpen={() => openApp(i.appId, i.label, i.icon, i.items)} 
              onMove={(id, x, y) => setDesktopItems(prev => prev.map(item => item.id === id ? { ...item, gridX: x, gridY: y } : item))}
              isSelected={selectedItemIds.has(i.id)}
            />
          ))}
        </div>
        
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
        onOpenApp={(appId, title, icon) => openApp(appId, title, icon)}
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
