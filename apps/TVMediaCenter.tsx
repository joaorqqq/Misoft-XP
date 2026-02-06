
import React, { useState, useEffect } from 'react';

interface TVChannel {
  id: string;
  name: string;
  url: string;
  thumb: string;
}

export const TVMediaCenter: React.FC<{ onOpenUrl?: (url: string) => void }> = ({ onOpenUrl }) => {
  const [isBrokenMode, setIsBrokenMode] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const channels: TVChannel[] = [
    { id: 'yt', name: 'YouTube', url: 'https://youtube.com', thumb: 'https://www.youtube.com/s/desktop/28236f04/img/favicon_144x144.png' },
    { id: 'espn', name: 'ESPN', url: 'https://espn.com', thumb: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/ESPN_wordmark.svg' },
    { id: 'cnn', name: 'CNN Video', url: 'https://cnn.com', thumb: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/CNN.svg' },
    { id: 'google', name: 'Google', url: 'https://google.com', thumb: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png' },
    { id: 'wiki', name: 'Wikipedia', url: 'https://wikipedia.org', thumb: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png' },
    { id: 'vimeo', name: 'Vimeo', url: 'https://vimeo.com', thumb: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Vimeo_logo.svg' },
    { id: 'yahoo', name: 'Yahoo!', url: 'https://yahoo.com', thumb: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Yahoo%21_Logo_2019.svg' },
    { id: 'msn', name: 'MSN', url: 'https://msn.com', thumb: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/MSN_logo_2014.svg' },
  ];

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setActiveIdx(p => Math.min(p + 1, channels.length - 1));
      if (e.key === 'ArrowLeft') setActiveIdx(p => Math.max(p - 1, 0));
      if (e.key === 'Enter') onOpenUrl?.(channels[activeIdx].url);
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [activeIdx]);

  return (
    <div className="relative h-full bg-[#f4f7f4] font-[sans-serif] overflow-hidden flex flex-col select-none tv-container">
      {/* Smart TV Header */}
      <div className="bg-[#e2e8e2] border-b border-gray-300 p-4 flex justify-between items-center px-10">
        <div className="flex items-center gap-8">
          <div className="text-gray-600 font-bold text-xl flex items-center gap-2">
             <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
             Em Destaque
          </div>
          <div className="flex gap-6 text-sm">
            <span className="text-blue-600 font-bold cursor-pointer border-b-2 border-blue-600 pb-1">Mais visitados</span>
            <span className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">Marcadores</span>
          </div>
        </div>
        
        <div className="flex-1 max-w-md mx-8">
           <div className="bg-white/80 border border-gray-300 rounded-full px-4 py-1.5 flex items-center gap-3 text-sm text-gray-500 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <span>Insira o URL ou a palavra-chave</span>
           </div>
        </div>

        <div className="flex items-center gap-6">
           <button 
             onClick={() => setIsBrokenMode(!isBrokenMode)}
             className="text-[10px] bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200 hover:bg-red-200 transition-colors uppercase font-bold"
           >
             {isBrokenMode ? "Consertar Smart TV" : "Modo Foto Real"}
           </button>
           <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="w-6 h-6 rounded-full bg-gray-200"></div>
              <span>Abrir G...</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
           </div>
        </div>
      </div>

      {/* Grid de Canais */}
      <div className="flex-1 p-10 overflow-y-auto xp-scrollbar bg-gradient-to-b from-[#f4f7f4] to-[#eef2ee]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {channels.map((ch, idx) => (
            <div 
              key={ch.id}
              onClick={() => onOpenUrl?.(ch.url)}
              onMouseEnter={() => setActiveIdx(idx)}
              className={`bg-white border-2 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col group ${activeIdx === idx ? 'border-blue-500 scale-105 ring-4 ring-blue-500/20' : 'border-gray-200'}`}
            >
              <div className="h-36 bg-gray-50 flex items-center justify-center p-8 grayscale-[0.2] group-hover:grayscale-0 transition-all">
                <img src={ch.thumb} className="max-h-full max-w-full object-contain drop-shadow-sm" alt={ch.name} />
              </div>
              <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${activeIdx === idx ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span className={`text-sm font-bold ${activeIdx === idx ? 'text-blue-700' : 'text-gray-600'}`}>{ch.name}</span>
                </div>
                {activeIdx === idx && (
                   <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded uppercase">Selecionado</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Easter Egg: Efeito de Tela Quebrada/Linhas Verticais da foto */}
      {isBrokenMode && (
        <div className="absolute inset-0 pointer-events-none z-[1000] overflow-hidden">
          {/* Linha principal grossa (preta) */}
          <div className="absolute top-0 bottom-0 left-[41.2%] w-[6px] bg-black/95 shadow-[0_0_15px_rgba(0,0,0,0.8)]"></div>
          {/* Linhas finas de pixel queimado */}
          <div className="absolute top-0 bottom-0 left-[41.8%] w-[1px] bg-gray-800/40"></div>
          <div className="absolute top-0 bottom-0 left-[41.9%] w-[1px] bg-blue-900/20"></div>
          <div className="absolute top-0 bottom-0 left-[43.5%] w-[2px] bg-black/80"></div>
          <div className="absolute top-0 bottom-0 left-[48.1%] w-[3px] bg-black/70 shadow-[0_0_8px_rgba(0,0,0,0.3)]"></div>
          {/* Pequenas rachaduras e ruído */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(rgba(255,255,255,0.03),rgba(255,255,255,0.03)_1px,transparent_1px,transparent_2px)] opacity-30"></div>
          <div className="absolute top-[20%] left-[41.2%] w-20 h-20 bg-black blur-xl opacity-20"></div>
        </div>
      )}

      {/* Cursor Estilo TV */}
      <style>{`
        .tv-container {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white" stroke="black" stroke-width="1"><path d="M7 2l12 11.5-4.5.5L18 20l-3 1.5-3.5-6.5L7 19V2z"/></svg>'), auto;
        }
        .tv-container * {
          cursor: inherit;
        }
      `}</style>
    </div>
  );
};
