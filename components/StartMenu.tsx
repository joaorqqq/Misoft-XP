
import React from 'react';
import { AppId } from '../types';

interface StartMenuProps {
  isOpen: boolean;
  isAdmin?: boolean;
  onOpenApp: (id: AppId) => void;
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, isAdmin, onOpenApp, onClose }) => {
  if (!isOpen) return null;

  const leftApps = [
    { id: AppId.INTERNET_EXPLORER, label: 'Internet Explorer', icon: 'https://win98icons.alexmeub.com/icons/png/internet_explorer-5.png' },
    { id: AppId.CMD, label: 'Prompt de Comando', icon: 'https://win98icons.alexmeub.com/icons/png/msdos-0.png' },
    { id: AppId.TERMUX, label: 'Termux Terminal', icon: 'https://win98icons.alexmeub.com/icons/png/console_prompt-0.png' },
    { id: AppId.MINESWEEPER, label: 'Campo Minado', icon: 'https://win98icons.alexmeub.com/icons/png/mine-0.png' },
    { id: AppId.MSN_MESSENGER, label: 'MSN Messenger', icon: 'https://win98icons.alexmeub.com/icons/png/msn_messenger-0.png' },
    { id: AppId.MEDIA_PLAYER, label: 'Windows Media Player', icon: 'https://win98icons.alexmeub.com/icons/png/mmsys_cp-0.png' },
    { id: AppId.PAINT, label: 'Paint', icon: 'https://win98icons.alexmeub.com/icons/png/paint_old-4.png' },
    { id: AppId.NOTEPAD, label: 'Bloco de Notas', icon: 'https://win98icons.alexmeub.com/icons/png/notepad-5.png' },
    { id: AppId.CALCULATOR, label: 'Calculadora', icon: 'https://win98icons.alexmeub.com/icons/png/calculator-0.png' },
  ];

  const rightLinks = [
    { id: AppId.DOCUMENTS, label: 'Meus Documentos', icon: 'https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png', bold: true },
    { id: AppId.MY_COMPUTER, label: 'Meu Computador', icon: 'https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png', bold: true },
    { separator: true },
    { id: AppId.CONTROL_PANEL, label: 'Painel de Controle', icon: 'https://win98icons.alexmeub.com/icons/png/control_panel-4.png' },
    ...(isAdmin ? [{ id: AppId.ADM_PAINEL, label: 'Painel Admin', icon: 'https://win98icons.alexmeub.com/icons/png/users-0.png' }] : []),
    { id: AppId.SETTINGS, label: 'Configurações', icon: 'https://win98icons.alexmeub.com/icons/png/gears-0.png' },
    { id: AppId.RECYCLE_BIN, label: 'Lixeira', icon: 'https://win98icons.alexmeub.com/icons/png/recycle_bin_empty-4.png' },
  ];

  return (
    <div className="fixed bottom-[30px] left-0 w-[380px] bg-[#245edb] border-2 border-[#0053e1] rounded-t-lg xp-start-menu z-[100000] flex flex-col font-[Tahoma] overflow-hidden select-none">
      <div className="xp-blue-gradient h-[55px] flex items-center px-3 gap-3 border-b border-white/20">
        <div className="w-10 h-10 rounded border-2 border-white shadow-md overflow-hidden bg-white">
          <img src={`https://picsum.photos/seed/${isAdmin ? 'admin' : 'user'}/40`} alt="" className="w-full h-full" />
        </div>
        <span className="text-white font-bold text-sm shadow-sm">{isAdmin ? 'Administrator' : 'Usuário XP'}</span>
      </div>

      <div className="flex bg-white flex-1">
        <div className="w-[190px] p-1.5 flex flex-col">
          {leftApps.map(app => (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              className="flex items-center gap-2 p-1.5 hover:bg-[#2f71cd] hover:text-white rounded-sm group text-left"
            >
              <img src={app.icon} className="w-8 h-8 group-hover:brightness-110" alt="" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold">{app.label}</span>
              </div>
            </button>
          ))}
          <div className="mt-auto border-t border-gray-200 pt-2 pb-1">
            <button className="w-full flex items-center justify-between px-2 py-1 text-[11px] hover:bg-gray-100 font-bold">
              Todos os Programas
              <span className="text-green-600">▶</span>
            </button>
          </div>
        </div>

        <div className="w-[190px] bg-[#d3e5fa] p-1.5 border-l border-white flex flex-col">
          {rightLinks.map((link, idx) => (
            link.separator ? (
              <div key={idx} className="h-px bg-blue-300 my-1 mx-2"></div>
            ) : (
              <button
                key={link.id}
                onClick={() => link.id && onOpenApp(link.id)}
                className="flex items-center gap-2 p-1.5 hover:bg-[#2f71cd] hover:text-white rounded-sm group text-left"
              >
                <img src={link.icon} className="w-6 h-6" alt="" />
                <span className={`text-[11px] ${link.bold ? 'font-bold' : ''}`}>{link.label}</span>
              </button>
            )
          ))}
        </div>
      </div>

      <div className="xp-blue-gradient h-[45px] flex justify-end items-center px-4 gap-4">
        <button className="flex items-center gap-2 group" onClick={() => window.location.reload()}>
          <div className="w-6 h-6 bg-orange-500 rounded border border-white flex items-center justify-center group-hover:brightness-110">
            <img src="https://win98icons.alexmeub.com/icons/png/key_win-0.png" className="w-4 h-4" alt="" />
          </div>
          <span className="text-white text-[11px] font-bold group-hover:underline">Fazer Logoff</span>
        </button>
      </div>
    </div>
  );
};
