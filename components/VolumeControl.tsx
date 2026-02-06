
import React, { useState } from 'react';

export const VolumeControl: React.FC = () => {
  const [vol, setVol] = useState(80);

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] p-4 font-[Tahoma] select-none">
      <div className="flex-1 flex gap-8 items-center justify-center">
         <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] font-bold">Volume</span>
            <div className="relative h-40 w-8 bg-gray-300 border-2 border-inset border-gray-500 rounded flex flex-col justify-end p-1">
               <div 
                 className="w-full bg-gradient-to-t from-green-600 to-green-400 shadow-inner"
                 style={{ height: `${vol}%` }}
               ></div>
               <input 
                 type="range" 
                 min="0" max="100" 
                 value={vol} 
                 onChange={e => setVol(parseInt(e.target.value))}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer orientation-vertical"
                 style={{ appearance: 'slider-vertical' } as any}
               />
            </div>
            <span className="text-[10px]">{vol}%</span>
         </div>

         <div className="flex flex-col gap-4 text-[11px]">
            <label className="flex items-center gap-2">
               <input type="checkbox" defaultChecked /> Sem Áudio
            </label>
            <div className="p-3 border-2 border-inset border-gray-400 bg-white/50 space-y-2">
               <div className="font-bold border-b pb-1 mb-1">Dispositivo</div>
               <div>Realtek AC97 Audio</div>
            </div>
         </div>
      </div>
      <div className="mt-4 flex justify-end">
         <button className="px-4 py-1 bg-gray-200 border border-gray-500 text-xs shadow-sm hover:bg-white active:shadow-inner">Avançado...</button>
      </div>
    </div>
  );
};
