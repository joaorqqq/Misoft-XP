
import React from 'react';

export const Photoshop: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#757575] font-[Tahoma] overflow-hidden select-none">
      <div className="bg-[#D4D0C8] border-b border-gray-400 p-1 flex gap-4 text-[11px]">
        <span className="px-2 hover:bg-[#0A246A] hover:text-white">File</span>
        <span className="px-2 hover:bg-[#0A246A] hover:text-white">Edit</span>
        <span className="px-2 hover:bg-[#0A246A] hover:text-white">Image</span>
        <span className="px-2 hover:bg-[#0A246A] hover:text-white">Layer</span>
        <span className="px-2 hover:bg-[#0A246A] hover:text-white">Select</span>
        <span className="px-2 hover:bg-[#0A246A] hover:text-white">Filter</span>
        <span className="px-2 hover:bg-[#0A246A] hover:text-white">View</span>
      </div>
      
      <div className="flex flex-1 overflow-hidden p-1 gap-1">
        {/* Toolbox */}
        <div className="w-10 bg-[#D4D0C8] border border-gray-400 flex flex-col gap-1 p-1">
           {[...Array(12)].map((_, i) => (
             <div key={i} className="w-full aspect-square border border-gray-500 bg-gray-200 shadow-sm"></div>
           ))}
        </div>
        
        {/* Workspace */}
        <div className="flex-1 bg-[#505050] flex items-center justify-center overflow-auto">
           <div className="w-[400px] h-[300px] bg-white shadow-2xl relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                 <img src="https://win98icons.alexmeub.com/icons/png/paint_old-1.png" className="w-32 h-32" alt="" />
              </div>
              <div className="p-4 text-[10px] text-gray-400">Untitled-1 @ 100% (RGB/8)</div>
           </div>
        </div>

        {/* Panels */}
        <div className="w-48 flex flex-col gap-1">
           <div className="flex-1 bg-[#D4D0C8] border border-gray-400">
              <div className="bg-[#0A246A] text-white text-[10px] px-2 py-0.5">Layers</div>
              <div className="p-2 bg-white m-1 border border-gray-400 h-32">Background</div>
           </div>
           <div className="h-32 bg-[#D4D0C8] border border-gray-400">
              <div className="bg-[#0A246A] text-white text-[10px] px-2 py-0.5">Color</div>
              <div className="p-1 h-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500"></div>
           </div>
        </div>
      </div>
    </div>
  );
};
