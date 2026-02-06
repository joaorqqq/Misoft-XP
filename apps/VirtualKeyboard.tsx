
import React from 'react';

export const VirtualKeyboard: React.FC = () => {
  const keys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'BS'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENT'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', 'SPC']
  ];

  const handleKey = (key: string) => {
    let char = key;
    if (key === 'SPC') char = ' ';
    if (key === 'ENT') char = '\n';
    
    // Simula a digitação no elemento focado
    const active = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
      if (key === 'BS') {
        active.value = active.value.slice(0, -1);
      } else {
        active.value += char;
      }
      // Dispara evento de input para o React perceber a mudança
      active.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#D4D0C8] p-2 select-none">
      <div className="flex-1 flex flex-col gap-1">
        {keys.map((row, i) => (
          <div key={i} className="flex gap-1 flex-1">
            {row.map(key => (
              <button
                key={key}
                onClick={() => handleKey(key)}
                className={`flex-1 border-2 border-white border-r-[#808080] border-b-[#808080] bg-[#D4D0C8] active:border-inset font-bold text-xs sm:text-sm hover:bg-white/50 transition-colors ${
                  key === 'SPC' ? 'flex-[3]' : key === 'ENT' || key === 'BS' ? 'bg-[#c0c0c0] text-red-700' : ''
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="text-[9px] text-gray-500 mt-2 text-center">
        Dica: Clique em um campo de texto e use este teclado.
      </div>
    </div>
  );
};
