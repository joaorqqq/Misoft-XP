
import React, { useState } from 'react';
import { XP_SOUNDS, playSound } from '../utils/sounds';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [shouldReset, setShouldReset] = useState(false);

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': 
        if (b === 0) {
          playSound(XP_SOUNDS.ERROR);
          return 0;
        }
        return a / b;
      default: return b;
    }
  };

  const handleDigit = (digit: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(digit);
      setShouldReset(false);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleOperator = (nextOp: string) => {
    const current = parseFloat(display);

    if (memory === null) {
      setMemory(current);
    } else if (operator) {
      const result = calculate(memory, current, operator);
      setMemory(result);
      setDisplay(String(result));
    }

    setShouldReset(true);
    setOperator(nextOp === '=' ? null : nextOp);
  };

  const handleClear = () => {
    setDisplay('0');
    setMemory(null);
    setOperator(null);
    setShouldReset(false);
  };

  const handleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  return (
    <div className="flex flex-col h-full bg-[#D4D0C8] p-2 font-[Tahoma] select-none shadow-inner border-2 border-white border-r-[#808080] border-b-[#808080]">
      <div className="bg-white border-2 border-inset border-gray-500 p-2 mb-3 text-right text-2xl font-mono h-12 flex items-center justify-end shadow-inner overflow-hidden">
        {display}
      </div>
      
      <div className="grid grid-cols-4 gap-1 flex-1">
        {/* Row 1 */}
        <button onClick={handleClear} className="col-span-2 xp-calc-btn text-red-600">Backspace</button>
        <button onClick={handleClear} className="col-span-2 xp-calc-btn text-red-600">CE / C</button>
        
        {/* Row 2 */}
        <button onClick={() => handleDigit('7')} className="xp-calc-btn text-blue-800">7</button>
        <button onClick={() => handleDigit('8')} className="xp-calc-btn text-blue-800">8</button>
        <button onClick={() => handleDigit('9')} className="xp-calc-btn text-blue-800">9</button>
        <button onClick={() => handleOperator('/')} className="xp-calc-btn text-red-600">/</button>
        
        {/* Row 3 */}
        <button onClick={() => handleDigit('4')} className="xp-calc-btn text-blue-800">4</button>
        <button onClick={() => handleDigit('5')} className="xp-calc-btn text-blue-800">5</button>
        <button onClick={() => handleDigit('6')} className="xp-calc-btn text-blue-800">6</button>
        <button onClick={() => handleOperator('*')} className="xp-calc-btn text-red-600">*</button>
        
        {/* Row 4 */}
        <button onClick={() => handleDigit('1')} className="xp-calc-btn text-blue-800">1</button>
        <button onClick={() => handleDigit('2')} className="xp-calc-btn text-blue-800">2</button>
        <button onClick={() => handleDigit('3')} className="xp-calc-btn text-blue-800">3</button>
        <button onClick={() => handleOperator('-')} className="xp-calc-btn text-red-600">-</button>
        
        {/* Row 5 */}
        <button onClick={() => handleDigit('0')} className="xp-calc-btn text-blue-800">0</button>
        <button onClick={handleSign} className="xp-calc-btn text-blue-800">+/-</button>
        <button onClick={() => handleDigit('.')} className="xp-calc-btn text-blue-800">,</button>
        <button onClick={() => handleOperator('+')} className="xp-calc-btn text-red-600">+</button>
        
        {/* Equal */}
        <button onClick={() => handleOperator('=')} className="col-span-4 h-10 xp-calc-btn text-red-600 font-bold">=</button>
      </div>

      <style>{`
        .xp-calc-btn {
          background: #D4D0C8;
          border: 2px solid;
          border-color: #FFFFFF #808080 #808080 #FFFFFF;
          font-size: 12px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          outline: none;
        }
        .xp-calc-btn:active {
          border-color: #808080 #FFFFFF #FFFFFF #808080;
          padding: 1px 0 0 1px;
        }
      `}</style>
    </div>
  );
};
