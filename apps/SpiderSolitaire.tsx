
import React from 'react';

export const SpiderSolitaire: React.FC = () => {
  return (
    <div className="h-full bg-[#006633] flex flex-col items-center justify-center text-white font-[Tahoma] select-none p-4 overflow-hidden">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold shadow-sm">Spider Solitaire</h2>
        <p className="text-xs opacity-70">Versão XP Clássica</p>
      </div>

      <div className="grid grid-cols-10 gap-2 w-full max-w-4xl flex-1">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex flex-col gap-[-40px]">
             {[...Array(Math.floor(Math.random() * 5) + 3)].map((__, j) => (
               <div 
                 key={j}
                 className={`w-full aspect-[2/3] bg-white border border-gray-400 rounded-sm shadow-md flex items-center justify-center text-blue-900 font-bold text-xl`}
                 style={{ marginTop: j === 0 ? 0 : '-80%' }}
               >
                 {j === 0 ? '♠' : '?'}
               </div>
             ))}
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <button className="px-6 py-2 bg-white/10 border border-white/20 hover:bg-white/20 transition-colors rounded font-bold text-sm">Novo Jogo</button>
        <button className="px-6 py-2 bg-white/10 border border-white/20 hover:bg-white/20 transition-colors rounded font-bold text-sm">Dificuldade: 2 Naipes</button>
      </div>
      
      <div className="mt-4 text-[10px] opacity-40 italic">Interface em desenvolvimento...</div>
    </div>
  );
};
