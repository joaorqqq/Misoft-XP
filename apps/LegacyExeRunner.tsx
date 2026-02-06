
import React, { useState, useEffect } from 'react';

interface LegacyExeRunnerProps {
  type: 'doom_wasm' | string;
}

export const LegacyExeRunner: React.FC<LegacyExeRunnerProps> = ({ type }) => {
  const [loadingStep, setLoadingStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const buildSequence = [
    "brew install emscripten",
    "brew install automake",
    "brew install sdl2 sdl2_mixer sdl2_net",
    "cd src",
    "python -m SimpleHTTPServer",
    "./scripts/clean.sh",
    "./scripts/build.sh",
    "doom: 1, failed to connect to websockets server",
    "doom: 2, connected to wss://mxp-doom-relay-01.io",
    "doom: 4, ws error(eventType=1, userData=0)",
    "doom: 6, failed to send ws packet, reconnecting",
    "doom: 7, failed to connect to relay",
    "doom: 2, connected to backup server",
    "doom: 8, uid is 777",
    "doom: 10, game started",
    "doom: 11, entering fullscreen",
    "doom: 12, client 'Admin' connected",
  ];

  useEffect(() => {
    if (type === 'doom_wasm') {
      let i = 0;
      const interval = setInterval(() => {
        if (i < buildSequence.length) {
          const nextLog = buildSequence[i];
          if (nextLog) {
            setLogs(prev => [...prev, nextLog]);
          }
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => setLoadingStep(1), 1000);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [type]);

  if (loadingStep === 0) {
    return (
      <div className="h-full bg-black text-green-500 font-mono p-4 text-[10px] overflow-y-auto xp-scrollbar">
        <div className="mb-4 text-white font-bold border-b border-white/20 pb-1 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="https://win98icons.alexmeub.com/icons/png/executable-0.png" className="w-4 h-4" alt="" />
            <span>MXP-WASM-LOADER v2.6.4</span>
          </div>
          <span className="text-gray-500 text-[8px]">EMULATOR_MODE</span>
        </div>
        <div className="space-y-1">
          {logs.map((log, idx) => (
            <div key={idx} className={(log?.includes('failed') || log?.includes('error')) ? 'text-red-500' : ''}>
              {(log?.startsWith('./') || log?.startsWith('brew') || log?.startsWith('cd') || log?.startsWith('python')) ? 
                <span className="text-yellow-400">$ {log}</span> : `> ${log}`}
            </div>
          ))}
          <div className="animate-pulse">_</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black flex flex-col items-center justify-center overflow-hidden font-mono">
      <div className="relative group w-full h-full flex flex-col">
        <div className="absolute top-2 right-4 text-green-500 text-[9px] z-20 bg-black/60 px-2 py-1 border border-green-500/20 shadow-lg">
          MXP_CORE: ACTIVE<br/>
          MEMORY: 128.5MB<br/>
          LATENCY: 12ms
        </div>
        
        <div className="flex-1 flex items-center justify-center relative bg-[#050505]">
            <img 
                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZhcWdyYWN3bmJ2cnh6eGdzdzB4ZWd4eW9yeGg5YmN5eHh4eXh4eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MSf0H8YfS9iI8/giphy.gif" 
                className="w-full h-auto object-contain brightness-110 contrast-125"
                alt="Doom"
            />
            {/* Overlay de HUD superior */}
            <div className="absolute top-4 left-4 text-white text-shadow-sm font-bold text-xs uppercase flex flex-col gap-1">
               <span className="text-green-500">Nível 1: Hangar</span>
               <span className="text-gray-400">Objetivo: Sobreviver</span>
            </div>
        </div>
        
        {/* Doom Status Bar */}
        <div className="bg-[#1a1a1a] w-full p-2 flex justify-between items-center border-t-2 border-[#444] text-red-600 text-lg shadow-[inset_0_4px_12px_black] px-8 h-16">
            <div className="flex flex-col items-center leading-none">
                <span className="text-[8px] text-gray-500 uppercase mb-1">Munição</span>
                <span className="drop-shadow-[0_0_5px_red] font-black">50</span>
            </div>
            <div className="flex flex-col items-center leading-none">
                <span className="text-[8px] text-gray-500 uppercase mb-1">Vida</span>
                <span className="drop-shadow-[0_0_5px_red] font-black">100%</span>
            </div>
            
            <div className="w-12 h-12 bg-black border-2 border-red-900 shadow-inner flex items-center justify-center overflow-hidden rounded-sm relative">
                <img 
                    src="https://www.spriters-resource.com/resources/sheets/28/31206.png" 
                    className="w-32 max-w-none absolute left-[-16px] top-[-10px] grayscale brightness-150 contrast-150" 
                    alt="Doom Guy" 
                />
                <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none"></div>
            </div>
            
            <div className="flex flex-col items-center leading-none">
                <span className="text-[8px] text-gray-500 uppercase mb-1">Arma</span>
                <span className="drop-shadow-[0_0_5px_red] font-black">2</span>
            </div>
            <div className="flex flex-col items-center leading-none">
                <span className="text-[8px] text-gray-500 uppercase mb-1">Frags</span>
                <span className="drop-shadow-[0_0_5px_red] font-black">0</span>
            </div>
        </div>
      </div>
    </div>
  );
};