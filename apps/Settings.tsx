
import React, { useState } from 'react';
import { XP_SOUNDS, playSound } from '../utils/sounds';

export const Settings: React.FC<any> = ({ onUpdateWallpaper, onOpenCredits }) => {
  const [activeTab, setActiveTab] = useState('desktop');
  const [previewWp, setPreviewWp] = useState('https://wallpapers.com/images/hd/windows-xp-original-0v799yv8r9n8n6e4.jpg');

  const themes = [
    { id: 'blue', name: 'Luna Blue (Padrão)', color: '#0058e4' },
    { id: 'olive', name: 'Olive Green', color: '#738a5d' },
    { id: 'silver', name: 'Silver Professional', color: '#c0c0c0' }
  ];

  const wallpapers = [
    { name: 'Bliss (XP Clássico)', url: 'https://wallpapers.com/images/hd/windows-xp-original-0v799yv8r9n8n6e4.jpg' },
    { name: 'Autumn', url: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/autumn-forest-windows-xp-wallpaper-vladimir-ovchinnikov.jpg' },
    { name: 'Azul Espacial', url: 'https://wallpaperaccess.com/full/1561577.jpg' },
    { name: 'Vortex', url: 'https://images2.alphacoders.com/584/584766.jpg' },
    { name: 'Windows Flag', url: 'https://images7.alphacoders.com/416/416200.jpg' }
  ];

  const handleApplyWallpaper = (url: string) => {
    onUpdateWallpaper(url);
    playSound(XP_SOUNDS.NOTIFY);
  };

  const handleThemeChange = (id: string) => {
    document.body.setAttribute('data-theme', id);
    playSound(XP_SOUNDS.CLICK);
  };

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] font-[Tahoma] select-none text-[#000]">
      <div className="bg-[#0058e4] xp-blue-gradient p-2 text-white border-b border-[#003399] flex items-center gap-2">
        <img src="https://win98icons.alexmeub.com/icons/png/gears-0.png" className="w-5 h-5" alt="" />
        <span className="font-bold text-sm">Propriedades de Exibição</span>
      </div>

      <div className="flex flex-1 overflow-hidden p-2 gap-2">
        {/* Sidebar */}
        <div className="w-36 bg-[#D4D0C8] border border-gray-400 p-1 space-y-1 shadow-sm">
          <button onClick={() => setActiveTab('display')} className={`w-full text-left px-3 py-1 text-[11px] font-bold ${activeTab === 'display' ? 'bg-[#316ac5] text-white' : 'hover:bg-blue-100'}`}>Temas</button>
          <button onClick={() => setActiveTab('desktop')} className={`w-full text-left px-3 py-1 text-[11px] font-bold ${activeTab === 'desktop' ? 'bg-[#316ac5] text-white' : 'hover:bg-blue-100'}`}>Área de Trabalho</button>
          <button onClick={() => setActiveTab('sounds')} className={`w-full text-left px-3 py-1 text-[11px] font-bold ${activeTab === 'sounds' ? 'bg-[#316ac5] text-white' : 'hover:bg-gray-200'}`}>Sons</button>
          <button onClick={() => setActiveTab('about')} className={`w-full text-left px-3 py-1 text-[11px] font-bold ${activeTab === 'about' ? 'bg-[#316ac5] text-white' : 'hover:bg-gray-200'}`}>Sobre</button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white border border-gray-400 p-4 overflow-y-auto xp-scrollbar">
          {activeTab === 'desktop' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-48 h-36 bg-[#333] border-4 border-gray-400 rounded p-1 shadow-xl">
                  <div 
                    className="w-full h-full bg-cover bg-center" 
                    style={{ backgroundImage: `url(${previewWp})` }}
                  ></div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-400 rounded-b"></div>
                </div>
                <span className="mt-6 text-[11px] font-bold text-gray-600">Pré-visualização da Área de Trabalho</span>
              </div>

              <div className="border border-gray-300 p-2">
                <h4 className="text-[11px] font-bold mb-2 bg-[#ece9d8] -mt-4 px-1 inline-block">Papel de Parede:</h4>
                <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto pr-1 xp-scrollbar">
                  {wallpapers.map(wp => (
                    <div 
                      key={wp.name}
                      onClick={() => setPreviewWp(wp.url)}
                      onDoubleClick={() => handleApplyWallpaper(wp.url)}
                      className={`cursor-pointer p-1 border ${previewWp === wp.url ? 'border-blue-600 bg-blue-50' : 'border-gray-100'} hover:bg-gray-50 flex items-center gap-2`}
                    >
                      <div className="w-8 h-6 bg-cover bg-center border border-gray-300" style={{ backgroundImage: `url(${wp.url})` }}></div>
                      <span className="text-[10px] truncate">{wp.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={() => handleApplyWallpaper(previewWp)}
                  className="bg-[#D4D0C8] border-2 border-white border-r-[#808080] border-b-[#808080] px-4 py-1 text-xs font-bold active:border-r-white active:border-b-white"
                >
                  Aplicar Agora
                </button>
              </div>
            </div>
          )}

          {activeTab === 'display' && (
            <div className="space-y-4">
               <h3 className="font-bold text-blue-800 text-sm border-b pb-1">Esquema de Cores</h3>
               <div className="space-y-2">
                  {themes.map(t => (
                    <button 
                      key={t.id}
                      onClick={() => handleThemeChange(t.id)}
                      className="w-full flex items-center gap-4 p-3 border border-gray-200 hover:bg-gray-50"
                    >
                      <div className="w-10 h-6 border border-gray-400" style={{ backgroundColor: t.color }}></div>
                      <span className="font-bold text-xs">{t.name}</span>
                    </button>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'sounds' && (
             <div className="space-y-4">
                <h3 className="font-bold text-blue-800 text-sm border-b pb-1">Testar Sons do Sistema</h3>
                <div className="grid grid-cols-2 gap-2">
                   {Object.entries(XP_SOUNDS).map(([key, url]) => (
                     <button 
                        key={key}
                        onClick={() => playSound(url)}
                        className="bg-gray-100 p-2 text-[10px] font-bold border hover:border-blue-500 text-left flex items-center gap-2"
                     >
                       <img src="https://win98icons.alexmeub.com/icons/png/loudspeaker_rays-0.png" className="w-4 h-4" alt="" />
                       {key}
                     </button>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'about' && (
            <div className="text-center py-10">
               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Windows_XP_Logo.svg/1024px-Microsoft_Windows_XP_Logo.svg.png" className="w-32 mx-auto mb-4" alt="" />
               <h2 className="text-xl font-bold text-blue-900">MXP Work Edition</h2>
               <p className="text-xs text-gray-500">Service Pack 2026</p>
               <div className="mt-8 flex justify-center">
                  <button 
                    onClick={onOpenCredits}
                    className="bg-blue-600 text-white px-6 py-2 rounded font-bold text-xs shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    VER CRÉDITOS & DOAÇÃO
                  </button>
               </div>
               <div className="mt-10 p-4 bg-yellow-50 border border-yellow-200 text-[10px] text-left">
                  Este sistema é uma recriação educacional feita com o máximo de carinho e nostalgia. 
                  Todos os direitos reservados à Microsoft Corporation pela marca Windows XP.
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};