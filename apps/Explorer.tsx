
import React, { useState, useEffect } from 'react';
import { DesktopItem, AppId } from '../types';

interface ExplorerProps {
  title: string;
  type: AppId;
  items?: DesktopItem[];
  onOpenApp: (item: DesktopItem) => void;
  onRestore?: (item: DesktopItem) => void;
}

export const Explorer: React.FC<ExplorerProps> = ({ title, type, items: propItems, onOpenApp, onRestore }) => {
  const [items, setItems] = useState<DesktopItem[]>([]);
  const [history, setHistory] = useState<string[]>([title]);

  const getIconForApp = (appId: AppId, exeType?: string) => {
    switch (appId) {
      case AppId.PAINT: return 'https://win98icons.alexmeub.com/icons/png/paint_old-4.png';
      case AppId.NOTEPAD: return 'https://win98icons.alexmeub.com/icons/png/notepad-0.png';
      case AppId.FOLDER: return 'https://win98icons.alexmeub.com/icons/png/directory_closed-4.png';
      case AppId.INTERNET_EXPLORER: return 'https://win98icons.alexmeub.com/icons/png/internet_explorer-5.png';
      case AppId.PHOTOSHOP: return 'https://win98icons.alexmeub.com/icons/png/paint_old-1.png';
      case AppId.CMD: return 'https://win98icons.alexmeub.com/icons/png/msdos-0.png';
      case AppId.CALCULATOR: return 'https://win98icons.alexmeub.com/icons/png/calculator-0.png';
      case AppId.MINESWEEPER: return 'https://win98icons.alexmeub.com/icons/png/mine-0.png';
      case AppId.TERMUX: return 'https://win98icons.alexmeub.com/icons/png/console_prompt-0.png';
      case AppId.SOLITAIRE: return 'https://win98icons.alexmeub.com/icons/png/solitaire-0.png';
      case AppId.MSN_MESSENGER: return 'https://win98icons.alexmeub.com/icons/png/msn_messenger-0.png';
      case AppId.MEDIA_PLAYER: return 'https://win98icons.alexmeub.com/icons/png/mmsys_cp-0.png';
      case AppId.OUTLOOK: return 'https://win98icons.alexmeub.com/icons/png/outlook_express-0.png';
      case AppId.GMAIL: return 'https://win98icons.alexmeub.com/icons/png/world-0.png';
      default: return 'https://win98icons.alexmeub.com/icons/png/file_windows-0.png';
    }
  };

  useEffect(() => {
    if (propItems) {
      setItems(propItems);
    } else if (type === AppId.MY_COMPUTER) {
      setItems([
        { id: 'drive-c', appId: AppId.FOLDER, label: 'Disco Local (C:)', icon: 'https://win98icons.alexmeub.com/icons/png/hard_disk_drive-4.png', gridX: 0, gridY: 0, items: [
          { id: 'prog-files', appId: AppId.FOLDER, label: 'Arquivos de Programas', icon: 'https://win98icons.alexmeub.com/icons/png/directory_program_group-4.png', gridX: 0, gridY: 0, items: [
            { id: 'app-paint', appId: AppId.PAINT, label: 'MS Paint', icon: 'https://win98icons.alexmeub.com/icons/png/paint_old-4.png', gridX: 0, gridY: 0, isShortcut: true },
            { id: 'app-calc', appId: AppId.CALCULATOR, label: 'Calculadora', icon: 'https://win98icons.alexmeub.com/icons/png/calculator-0.png', gridX: 0, gridY: 1, isShortcut: true },
            { id: 'app-note', appId: AppId.NOTEPAD, label: 'Bloco de Notas', icon: 'https://win98icons.alexmeub.com/icons/png/notepad-0.png', gridX: 0, gridY: 2, isShortcut: true },
            { id: 'app-mine', appId: AppId.MINESWEEPER, label: 'Campo Minado', icon: 'https://win98icons.alexmeub.com/icons/png/mine-0.png', gridX: 1, gridY: 0, isShortcut: true },
            { id: 'app-sol', appId: AppId.SOLITAIRE, label: 'Paciência', icon: 'https://win98icons.alexmeub.com/icons/png/solitaire-0.png', gridX: 1, gridY: 1, isShortcut: true },
            { id: 'app-msn', appId: AppId.MSN_MESSENGER, label: 'MSN Messenger', icon: 'https://win98icons.alexmeub.com/icons/png/msn_messenger-0.png', gridX: 1, gridY: 2, isShortcut: true },
            { id: 'app-wmp', appId: AppId.MEDIA_PLAYER, label: 'Windows Media Player', icon: 'https://win98icons.alexmeub.com/icons/png/mmsys_cp-0.png', gridX: 2, gridY: 0, isShortcut: true },
            { id: 'app-term', appId: AppId.TERMUX, label: 'Termux', icon: 'https://win98icons.alexmeub.com/icons/png/console_prompt-0.png', gridX: 2, gridY: 1, isShortcut: true }
          ]},
          { id: 'win-dir', appId: AppId.FOLDER, label: 'WINDOWS', icon: 'https://win98icons.alexmeub.com/icons/png/directory_closed-4.png', gridX: 0, gridY: 0, items: [] }
        ]},
        { id: 'cd-rom', appId: AppId.FOLDER, label: 'Unidade de CD (D:)', icon: 'https://win98icons.alexmeub.com/icons/png/cd_drive-4.png', gridX: 0, gridY: 1, items: [] }
      ]);
    } else if (type === AppId.DOCUMENTS) {
      setItems([
        { id: 'mus', appId: AppId.FOLDER, label: 'Minhas Músicas', icon: 'https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png', gridX: 0, gridY: 0, items: [] },
        { id: 'pic', appId: AppId.PAINT, label: 'Minhas Imagens', icon: 'https://win98icons.alexmeub.com/icons/png/paint_old-4.png', gridX: 0, gridY: 0 },
      ]);
    }
  }, [type, propItems]);

  const handleOpen = (item: DesktopItem) => {
    if (item.appId === AppId.FOLDER) {
      setHistory(prev => [...prev, item.label]);
      setItems(item.items || []);
    } else {
      onOpenApp(item);
    }
  };

  const handleRestore = (e: React.MouseEvent, item: DesktopItem) => {
    e.stopPropagation();
    if (onRestore) {
      onRestore(item);
      setItems(prev => prev.filter(i => i.id !== item.id));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white font-[Tahoma] select-none">
      <div className="bg-[#ece9d8] border-b border-gray-300 p-0.5 flex gap-4 text-[11px] h-6 items-center px-2">
        <span>Arquivo</span><span>Editar</span><span>Exibir</span><span>Ajuda</span>
      </div>
      <div className="flex items-center gap-1 p-1 bg-[#ece9d8] border-b border-gray-300 text-[11px]">
        <button className="px-2 py-0.5 border border-gray-400 bg-white hover:bg-gray-100" onClick={() => window.location.reload()}>Início</button>
        <div className="flex-1 flex items-center bg-white border border-gray-400 px-1 ml-2 h-5 overflow-hidden">
           <span className="text-gray-400 mr-2">Endereço:</span>
           <span className="text-black truncate">{history.join(' > ')}</span>
        </div>
      </div>
      <div className="flex-1 p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 content-start overflow-y-auto xp-scrollbar bg-white">
        {items.map(item => (
          <div key={item.id} className="flex flex-col items-center gap-1 group relative" onDoubleClick={() => handleOpen(item)}>
            <div className="w-12 h-12 flex items-center justify-center group-hover:bg-blue-100 rounded border border-transparent group-hover:border-blue-200 relative">
              <img src={getIconForApp(item.appId, item.exeType)} alt="" className="w-10 h-10" />
              {type === AppId.RECYCLE_BIN && (
                <button onClick={(e) => handleRestore(e, item)} className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full w-4 h-4 text-[8px] flex items-center justify-center border border-white opacity-0 group-hover:opacity-100 transition-opacity" title="Restaurar">↑</button>
              )}
            </div>
            <span className="text-[11px] text-center group-hover:bg-[#0a246a] group-hover:text-white px-1 py-0.5 rounded-sm break-all line-clamp-2 max-w-[80px]">
              {item.label}{item.isShortcut ? ' (Atalho)' : ''}
            </span>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full text-center text-gray-300 text-xs py-10 italic">Pasta Vazia</div>}
      </div>
      <div className="bg-[#ece9d8] border-t border-gray-300 p-1 text-[10px] text-gray-600 flex justify-between px-3 h-6 items-center">
        <span>{items.length} objetos</span>
        <span>Meu Computador</span>
      </div>
    </div>
  );
};
