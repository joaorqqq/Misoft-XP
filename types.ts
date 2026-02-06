
export enum AppId {
  MY_COMPUTER = 'MY_COMPUTER',
  RECYCLE_BIN = 'RECYCLE_BIN',
  DOCUMENTS = 'DOCUMENTS',
  INTERNET_EXPLORER = 'INTERNET_EXPLORER',
  NOTEPAD = 'NOTEPAD',
  PAINT = 'PAINT',
  PHOTOSHOP = 'PHOTOSHOP',
  TERMUX = 'TERMUX',
  MINESWEEPER = 'MINESWEEPER',
  MSN_MESSENGER = 'MSN_MESSENGER',
  MEDIA_PLAYER = 'MEDIA_PLAYER',
  SOLITAIRE = 'SOLITAIRE',
  SPIDER_SOLITAIRE = 'SPIDER_SOLITAIRE',
  FOLDER = 'FOLDER',
  CONTROL_PANEL = 'CONTROL_PANEL',
  SETTINGS = 'SETTINGS',
  CALCULATOR = 'CALCULATOR',
  CMD = 'CMD',
  VOLUME_CONTROL = 'VOLUME_CONTROL',
  OUTLOOK = 'OUTLOOK',
  GMAIL = 'GMAIL',
  ADM_PAINEL = 'ADM_PAINEL',
  MXP_FEED = 'MXP_FEED',
  CREDITS = 'CREDITS'
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number | string;
  height: number | string;
  data?: any;
}

export interface User {
  username: string;
  password: string;
  avatar: string;
  isAdmin?: boolean;
  isBanned?: boolean;
}

export interface DesktopItem {
  id: string;
  appId: AppId;
  label: string;
  icon: string;
  gridX: number;
  gridY: number;
  exeType?: string;
  content?: string;
  url?: string;
  items?: DesktopItem[];
  isShortcut?: boolean;
}

export interface DesktopIconData {
  id: AppId;
  label: string;
  icon: string;
  gridX: number;
  gridY: number;
}
