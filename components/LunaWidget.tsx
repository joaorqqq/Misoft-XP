
import React, { useState, useEffect } from 'react';

export type LunaMood = 'idle' | 'angry' | 'happy' | 'thinking';

interface LunaWidgetProps {
  mood: LunaMood;
  isAfk: boolean;
}

export const LunaWidget: React.FC<LunaWidgetProps> = ({ mood, isAfk }) => {
  const [frame, setFrame] = useState(0);

  // Simulated frame-based animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const getFilter = () => {
    if (isAfk) return 'grayscale(1) contrast(0.8) opacity(0.7)';
    if (mood === 'angry') return 'sepia(0.5) hue-rotate(-50deg) saturate(3) drop-shadow(0 0 10px red)';
    if (mood === 'thinking') return 'brightness(1.2) saturate(1.5) drop-shadow(0 0 10px blue)';
    return 'drop-shadow(0 0 15px rgba(59,139,248,0.4))';
  };

  const getMessage = () => {
    if (isAfk) return "Modo de Economia: Peer ausente.";
    switch (mood) {
      case 'angry': return "Não tente burlar o sistema! ByeGon detectará macros!";
      case 'thinking': return "Processando transação Peer-to-Peer...";
      case 'happy': return "Economia estável! Você está ganhando XPCoins.";
      default: return "Olá! Sou o MXP Assistant. Mantenha-se ativo para lucrar.";
    }
  };

  return (
    <div className="fixed bottom-12 right-6 z-[4000] pointer-events-none select-none flex flex-col items-center group cursor-help pointer-events-auto">
      <div className="bg-white/95 border-2 border-blue-500 rounded-xl p-3 mb-2 shadow-2xl text-[12px] font-bold text-blue-900 max-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity relative animate-bounce">
        {getMessage()}
        <div className="absolute -bottom-2 right-1/2 translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-blue-500 rotate-45"></div>
      </div>
      <div className="relative">
        <img 
          src="https://i.postimg.cc/gjwCvFkq/1000401773_removebg_preview.png"
          alt="MXP Assistant"
          className="w-24 h-24 object-contain transition-all duration-300"
          style={{ 
            filter: getFilter(),
            transform: `
              ${isAfk ? 'scale(0.85) translateY(15px)' : 'none'}
              ${!isAfk ? `translateY(${frame % 2 === 0 ? '2px' : '-2px'})` : ''}
              ${mood === 'angry' ? 'scale(1.15) rotate(5deg)' : ''}
            `
          }}
        />
        {!isAfk && <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-ping"></div>}
        {!isAfk && <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>}
      </div>
    </div>
  );
};