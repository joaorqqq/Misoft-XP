
import React from 'react';
import { XP_SOUNDS, playSound } from '../utils/sounds';

export const Credits: React.FC = () => {
  const PIX_QR_URL = "https://i.postimg.cc/j5qncT92/IMG_20260205_WA0004.jpg";
  const TEAM_LOGO_URL = "https://i.postimg.cc/cHJGzv01/Picsart-26-02-06-15-16-00-966.jpg";
  const DISCORD_URL = "https://discord.gg/e2ty8RQyu";
  const SUPPORT_EMAIL = "mxpteamsuport@gmail.com";

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] font-[Tahoma] overflow-hidden select-none">
      <div className="bg-[#0058e4] xp-blue-gradient p-2 text-white flex items-center gap-2">
        <img src="https://win98icons.alexmeub.com/icons/png/help_book_computer-4.png" className="w-4 h-4" alt="" />
        <span className="font-bold text-xs">Sobre o Windows XP - MXP Work Edition</span>
      </div>

      <div className="flex-1 p-6 overflow-y-auto xp-scrollbar bg-white m-2 border border-gray-400 shadow-inner flex flex-col items-center">
        <div className="flex flex-col items-center gap-4 mb-6">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Windows_XP_Logo.svg" 
            className="w-40 drop-shadow-md" 
            alt="Windows XP" 
          />
          <div className="flex flex-col items-center">
             <img src={TEAM_LOGO_URL} className="w-20 h-20 rounded-full border-2 border-blue-600 shadow-lg object-cover" alt="MXP Logo" />
             <span className="text-[10px] font-bold text-blue-800 mt-1 uppercase tracking-tighter">Official MXP Team Logo</span>
          </div>
        </div>
        
        <div className="w-full space-y-4 text-sm text-gray-800">
          <div className="border-b-2 border-blue-600 pb-1 font-bold text-blue-900 uppercase tracking-wider">
            Equipe de Desenvolvimento
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Idealização & Código:</strong> MXP Work Group</li>
            <li><strong>Motor de Sistema:</strong> MXP Engine v2.0</li>
            <li><strong>Design Retro:</strong> Alex Meub Icons Archive</li>
            <li><strong>Sons & Nostalgia:</strong> Vocaroo Community</li>
          </ul>

          <div className="border-b-2 border-indigo-600 pb-1 font-bold text-indigo-900 uppercase tracking-wider pt-4">
            Comunidade
          </div>
          <div className="flex flex-col items-center p-3 bg-indigo-50 border border-indigo-200 rounded">
            <p className="text-xs mb-2 text-center">Junte-se à nossa comunidade para atualizações e suporte!</p>
            <a 
              href={DISCORD_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#5865F2] text-white px-6 py-2 rounded font-bold text-xs shadow hover:bg-[#4752C4] transition-colors flex items-center gap-2"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/2111/2111370.png" className="w-4 h-4 invert" alt="" />
              ENTRAR NO DISCORD
            </a>
          </div>

          <div className="border-b-2 border-yellow-600 pb-1 font-bold text-yellow-800 uppercase tracking-wider pt-4">
            Apoie o Projeto (Donation)
          </div>
          <p className="text-xs leading-relaxed italic">
            Gostou da experiência? Escaneie o QR Code abaixo para contribuir com o Service Pack 2026.
          </p>
          
          <div className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded flex flex-col items-center gap-3">
            <div className="font-bold text-red-700 uppercase">Doação via PIX:</div>
            <img src={PIX_QR_URL} className="w-32 h-32 border-2 border-white shadow-md bg-white" alt="PIX QR Code" />
            
            <div className="h-px w-full bg-yellow-200"></div>
            
            <div className="text-center">
              <div className="font-bold text-blue-800 text-[10px]">E-MAIL DE SUPORTE:</div>
              <code className="text-[12px] font-mono block mb-2">{SUPPORT_EMAIL}</code>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(SUPPORT_EMAIL);
                  playSound(XP_SOUNDS.NOTIFY);
                  alert("E-mail de suporte copiado!");
                }}
                className="bg-[#D4D0C8] border-2 border-white border-r-[#808080] border-b-[#808080] px-4 py-1 text-[10px] font-bold active:border-r-white active:border-b-white"
              >
                COPIAR E-MAIL
              </button>
            </div>
          </div>

          <div className="pt-8 text-center text-[10px] text-gray-400">
            Microsoft, Windows e o logotipo do Windows são marcas registradas da Microsoft Corporation.<br/>
            Esta é uma obra de fã para fins educacionais e de entretenimento.
          </div>
        </div>
      </div>

      <div className="p-2 flex justify-end">
        <button 
          onClick={() => {
            const win = window as any;
            if(win.onCloseCredits) win.onCloseCredits();
            else window.location.reload();
          }}
          className="bg-[#D4D0C8] border-2 border-white border-r-[#808080] border-b-[#808080] px-6 py-1 text-xs font-bold active:border-r-white active:border-b-white"
        >
          OK
        </button>
      </div>
    </div>
  );
};
