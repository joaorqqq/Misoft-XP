import React, { useState, useEffect, useRef } from 'react';

interface HorrorGameProps {
  chapter: number;
  onEnd: () => void;
}

export const HorrorGame: React.FC<HorrorGameProps> = ({ chapter, onEnd }) => {
  const [step, setStep] = useState(0); 
  const [monsterDist, setMonsterDist] = useState(100);
  const [roomReached, setRoomReached] = useState(false);
  const [showFall, setShowFall] = useState(false);

  useEffect(() => {
    if (chapter === 2) {
      setShowFall(true);
      const timer = setTimeout(() => {
        // Stay in sewer
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [chapter]);

  useEffect(() => {
    const playStrangeSound = () => {
      const audio = new Audio('https://www.myinstants.com/media/sounds/scary-noise.mp3');
      audio.volume = 0.15;
      audio.play().catch(() => {});
    };
    const interval = setInterval(playStrangeSound, 12000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chapter === 1 && step === 1) {
      const handleMove = (e: KeyboardEvent) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'W', 'A', 'S', 'D'].includes(e.key.toUpperCase()) || e.key === 'ArrowUp') {
           setStep(2); 
        }
      };
      window.addEventListener('keydown', handleMove);
      return () => window.removeEventListener('keydown', handleMove);
    }
  }, [chapter, step]);

  useEffect(() => {
    if (step === 2) {
      const chaseInterval = setInterval(() => {
        setMonsterDist(d => {
          if (d <= 0) {
            alert("VOCÊ NÃO FOI RÁPIDO O SUFICIENTE");
            window.location.reload();
            return 0;
          }
          return d - 1.2;
        });
      }, 100);
      
      const finishTimer = setTimeout(() => {
        setRoomReached(true);
      }, 9000);

      return () => {
        clearInterval(chaseInterval);
        clearTimeout(finishTimer);
      };
    }
  }, [step]);

  if (chapter === 1) {
    if (roomReached) {
      return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-red-700 font-mono z-[300000] p-10 text-center animate-pulse">
          <h2 className="text-5xl font-bold mb-6 tracking-tighter">CAPÍTULO 1: O VAZIO</h2>
          <p className="text-white text-lg mb-2">A porta se fechou. Eles não podem entrar aqui.</p>
          <p className="text-gray-500 text-sm italic mb-10">Lembre-se dos números. Eles são a chave para a queda.</p>
          
          <div className="bg-white/5 border border-white/10 p-8 rounded-lg mb-12">
            <p className="text-white text-3xl font-black tracking-[1em] mb-4">1223345</p>
            <p className="text-white text-3xl font-black tracking-[1em]">1332245</p>
          </div>

          <button 
            onClick={onEnd} 
            className="border-2 border-red-700 px-12 py-3 text-red-700 hover:bg-red-700 hover:text-black font-bold transition-all duration-500 uppercase tracking-widest"
          >
            Retornar ao Terminal
          </button>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden z-[300000] cursor-none">
        <div className={`relative w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black ${step === 2 ? 'animate-pulse' : ''}`}>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[90%] h-[70%] border-2 border-white/5 relative overflow-hidden bg-black shadow-[0_0_150px_black_inset]">
                 <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-900/10"></div>
                 
                 <div className="absolute top-10 left-10 text-white/10 text-xs rotate-6 pointer-events-none">NÃO PARE</div>
                 <div className="absolute bottom-20 right-20 text-white/10 text-xs -rotate-12 pointer-events-none">ESTOU VENDO VOCÊ</div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-px shadow-[0_0_300px_80px_rgba(255,0,0,0.05)]"></div>
                 
                 {step === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center flex-col text-white text-center">
                       <p className="text-sm font-mono opacity-40 mb-8 animate-pulse">SISTEMA CORROMPIDO. SUBSOLO ACESSADO.</p>
                       <button 
                         onClick={() => setStep(1)} 
                         className="border border-white/20 px-8 py-2 hover:bg-white hover:text-black font-mono text-xs transition-all"
                       >
                         DESPERTAR
                       </button>
                    </div>
                 )}

                 {step >= 1 && (
                    <div className="w-full h-full flex items-center justify-center flex-col">
                       <div className="w-32 h-32 bg-red-900/5 rounded-full blur-[80px] mb-10"></div>
                       <div className="text-white/20 font-mono text-[10px] tracking-[0.5em] uppercase">
                          {step === 2 ? "A ENTIDADE ESTÁ PRÓXIMA" : "USE AS SETAS PARA SE MOVER"}
                       </div>
                       {step === 2 && (
                         <div className="mt-20 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                           <div 
                             className="h-full bg-red-600 transition-all duration-100" 
                             style={{ width: `${(100 - monsterDist)}%` }}
                           ></div>
                         </div>
                       )}
                    </div>
                 )}
              </div>
           </div>

           <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-screen bg-[url('https://media.giphy.com/media/oEI9uWUic9Zf2/giphy.gif')]"></div>
        </div>
      </div>
    );
  }

  if (chapter === 2) {
    return (
      <div className="fixed inset-0 bg-black z-[300000] flex flex-col items-center justify-center overflow-hidden">
        {showFall && (
          <div className="animate-plunge flex flex-col items-center absolute">
             <div className="w-24 h-24 bg-white/10 rounded border border-white/20 mb-6 flex items-center justify-center overflow-hidden">
                <img src="https://picsum.photos/seed/admin/100" className="w-full h-full opacity-50 grayscale" alt="" />
             </div>
             <p className="text-white font-mono text-2xl tracking-[0.3em] animate-pulse">CAINDO NO ABISMO</p>
          </div>
        )}
        
        <div className="absolute inset-0 bg-[#0a0f0a] opacity-0 animate-sewer-fade flex flex-col items-center justify-center p-20 text-center">
           <div className="mb-12 relative">
              <div className="absolute inset-0 bg-green-500/10 blur-3xl rounded-full"></div>
              <h1 className="text-green-600 font-black text-7xl tracking-tighter relative">BUEIRO</h1>
           </div>
           
           <div className="max-w-xl space-y-6">
              <p className="text-green-500/80 font-mono text-lg leading-relaxed">
                Você sobreviveu à queda. Mas aqui, as regras do Windows não se aplicam.<br/>
                O Capítulo 2 começou. Você está no coração do Underworld.
              </p>
              <p className="text-white/20 font-mono text-xs uppercase tracking-[0.4em] pt-10">
                Aguardando conexão com o servidor central...
              </p>
           </div>
           
           <button 
             onClick={() => window.location.reload()} 
             className="mt-24 border border-green-600/30 text-green-600 px-12 py-3 font-mono text-sm hover:bg-green-600 hover:text-black transition-all duration-700 uppercase"
           >
             Reiniciar Núcleo do Sistema
           </button>
        </div>

        <style>{`
          @keyframes plunge {
            0% { transform: translateY(-300px) scale(1.2); opacity: 0; }
            30% { transform: translateY(0) scale(1); opacity: 1; }
            100% { transform: translateY(1500px) scale(0.5); opacity: 0; }
          }
          @keyframes sewerFade {
            0% { opacity: 0; }
            70% { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-plunge { animation: plunge 4s forwards cubic-bezier(.76,0,.24,1); }
          .animate-sewer-fade { animation: sewerFade 6s forwards ease-out; }
        `}</style>
      </div>
    );
  }

  return null;
};
