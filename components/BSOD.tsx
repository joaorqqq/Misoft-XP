
import React, { useEffect, useState } from 'react';

interface BSODProps {
  onRestart: () => void;
  onEasterEgg: () => void;
}

export const BSOD: React.FC<BSODProps> = ({ onRestart, onEasterEgg }) => {
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        onEasterEgg();
      } else {
        onRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRestart, onEasterEgg]);

  const handleScreenClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      onEasterEgg();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-[#0000AA] text-[#AAAAAA] font-mono p-10 z-[100000] flex flex-col items-center justify-center text-lg select-none cursor-none overflow-hidden"
      onClick={handleScreenClick}
    >
      <div className="bg-[#AAAAAA] text-[#0000AA] px-4 mb-8">Windows XP</div>
      <div className="max-w-2xl w-full space-y-6">
        <p>A problem has been detected and Windows has been shut down to prevent damage to your computer.</p>
        <p>The problem seems to be caused by the following file: <span className="text-white">BYEDOWEL.SYS</span></p>
        <p>PAGE_FAULT_IN_NONPAGED_AREA</p>
        <p>If this is the first time you've seen this Stop error screen, restart your computer.</p>
        <p>Error: 0x00000050 (0xFD3094C2, 0x00000001, 0xFBFE7617, 0x00000000)</p>
        <div className="flex items-center justify-center mt-12 animate-pulse text-white">
          Press any key to restart _
        </div>
      </div>
    </div>
  );
};
