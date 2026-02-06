
import { AppId, DesktopIconData } from '../types';

export const WALLPAPER_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4xMbpyl9T7jUrTP3LL0M3Yyl_uUlpOomH2aNojyDLgQuPyFZDShsrkxw&s=10';

export const DESKTOP_ICONS: DesktopIconData[] = [
  // Coluna 1
  { id: AppId.MY_COMPUTER, label: 'Meu Computador', icon: 'https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png', gridX: 0, gridY: 0 },
  { id: AppId.DOCUMENTS, label: 'Meus Documentos', icon: 'https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png', gridX: 0, gridY: 1 },
  { id: AppId.RECYCLE_BIN, label: 'Lixeira', icon: 'https://win98icons.alexmeub.com/icons/png/recycle_bin_empty-4.png', gridX: 0, gridY: 2 },
  { id: AppId.INTERNET_EXPLORER, label: 'Internet Explorer', icon: 'https://win98icons.alexmeub.com/icons/png/internet_explorer-5.png', gridX: 0, gridY: 3 },
  { id: AppId.MSN_MESSENGER, label: 'MSN Messenger', icon: 'https://win98icons.alexmeub.com/icons/png/msn_messenger-0.png', gridX: 0, gridY: 4 },
  { id: AppId.MEDIA_PLAYER, label: 'Media Player', icon: 'https://win98icons.alexmeub.com/icons/png/mmsys_cp-0.png', gridX: 0, gridY: 5 },
  
  // Coluna 2
  { id: AppId.PAINT, label: 'MS Paint', icon: 'https://win98icons.alexmeub.com/icons/png/paint_old-4.png', gridX: 1, gridY: 0 },
  { id: AppId.NOTEPAD, label: 'Bloco de Notas', icon: 'https://win98icons.alexmeub.com/icons/png/notepad-0.png', gridX: 1, gridY: 1 },
  { id: AppId.MINESWEEPER, label: 'Campo Minado', icon: 'https://win98icons.alexmeub.com/icons/png/mine-0.png', gridX: 1, gridY: 2 },
  { id: AppId.SOLITAIRE, label: 'Paciência', icon: 'https://win98icons.alexmeub.com/icons/png/solitaire-0.png', gridX: 1, gridY: 3 },
  { id: AppId.CALCULATOR, label: 'Calculadora', icon: 'https://win98icons.alexmeub.com/icons/png/calculator-0.png', gridX: 1, gridY: 4 },
  { id: AppId.CMD, label: 'Prompt de Comando', icon: 'https://win98icons.alexmeub.com/icons/png/msdos-0.png', gridX: 1, gridY: 5 },
  
  // Coluna 3
  { id: AppId.PHOTOSHOP, label: 'Photoshop', icon: 'https://win98icons.alexmeub.com/icons/png/paint_old-1.png', gridX: 2, gridY: 0 },
  { id: AppId.TERMUX, label: 'Termux Terminal', icon: 'https://win98icons.alexmeub.com/icons/png/console_prompt-0.png', gridX: 2, gridY: 1 },
  { id: AppId.SPIDER_SOLITAIRE, label: 'Spider Solitaire', icon: 'https://win98icons.alexmeub.com/icons/png/solitaire-0.png', gridX: 2, gridY: 2 },
  { id: AppId.GMAIL, label: 'Gmail', icon: 'https://win98icons.alexmeub.com/icons/png/world-0.png', gridX: 2, gridY: 3 },
  { id: AppId.CREDITS, label: 'Créditos & Doação', icon: 'https://win98icons.alexmeub.com/icons/png/help_book_computer-4.png', gridX: 2, gridY: 4 },
];
