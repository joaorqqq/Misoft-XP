
import React, { useState, useEffect, useCallback } from 'react';

type CellValue = number | 'M' | null;
interface Cell {
  value: CellValue;
  revealed: boolean;
  flagged: boolean;
}

export const Minesweeper: React.FC = () => {
  const GRID_SIZE = 10;
  const MINE_COUNT = 10;

  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [minesLeft, setMinesLeft] = useState(MINE_COUNT);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const initGrid = useCallback(() => {
    const newGrid: Cell[][] = Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(null).map(() => ({ value: 0, revealed: false, flagged: false }))
    );

    // Place mines
    let placed = 0;
    while (placed < MINE_COUNT) {
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      if (newGrid[r][c].value !== 'M') {
        newGrid[r][c].value = 'M';
        placed++;
      }
    }

    // Calculate numbers
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[r][c].value === 'M') continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && newGrid[nr][nc].value === 'M') {
              count++;
            }
          }
        }
        newGrid[r][c].value = count;
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
    setMinesLeft(MINE_COUNT);
    setTimer(0);
    setTimerActive(false);
  }, []);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  useEffect(() => {
    let interval: any;
    if (timerActive && !gameOver && !win) {
      interval = setInterval(() => setTimer(t => Math.min(t + 1, 999)), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, gameOver, win]);

  const revealCell = (r: number, c: number) => {
    if (gameOver || win || grid[r][c].revealed || grid[r][c].flagged) return;

    if (!timerActive) setTimerActive(true);

    const newGrid = [...grid.map(row => [...row])];
    
    if (newGrid[r][c].value === 'M') {
      newGrid[r][c].revealed = true;
      setGameOver(true);
      setTimerActive(false);
      // Reveal all mines
      newGrid.forEach(row => row.forEach(cell => { if (cell.value === 'M') cell.revealed = true; }));
    } else {
      const floodFill = (row: number, col: number) => {
        if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE || newGrid[row][col].revealed || newGrid[row][col].flagged) return;
        newGrid[row][col].revealed = true;
        if (newGrid[row][col].value === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              floodFill(row + dr, col + dc);
            }
          }
        }
      };
      floodFill(r, c);
    }

    setGrid(newGrid);

    // Check win
    const totalCells = GRID_SIZE * GRID_SIZE;
    const revealedCount = newGrid.flat().filter(c => c.revealed).length;
    if (revealedCount === totalCells - MINE_COUNT && !gameOver) {
      setWin(true);
      setTimerActive(false);
    }
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || win || grid[r][c].revealed) return;
    const newGrid = [...grid.map(row => [...row])];
    const isFlagged = !newGrid[r][c].flagged;
    newGrid[r][c].flagged = isFlagged;
    setMinesLeft(prev => isFlagged ? prev - 1 : prev + 1);
    setGrid(newGrid);
  };

  const colors = ['', 'text-blue-600', 'text-green-600', 'text-red-600', 'text-blue-900', 'text-red-900', 'text-teal-600', 'text-black', 'text-gray-600'];

  return (
    <div className="bg-[#bdbdbd] p-1 border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#7b7b7b] flex flex-col items-center select-none h-full">
      {/* Header Panel */}
      <div className="w-full bg-[#bdbdbd] border-2 border-inset border-[#7b7b7b] p-1 mb-2 flex justify-between items-center px-4">
        <div className="bg-black text-red-600 font-mono text-2xl w-12 text-right px-1 border-2 border-[#7b7b7b]">
          {minesLeft.toString().padStart(3, '0')}
        </div>
        <button 
          onClick={initGrid}
          className="w-8 h-8 bg-[#bdbdbd] border-2 border-outset border-white flex items-center justify-center text-xl active:border-inset"
        >
          {gameOver ? '☹️' : win ? '😎' : '🙂'}
        </button>
        <div className="bg-black text-red-600 font-mono text-2xl w-12 text-right px-1 border-2 border-[#7b7b7b]">
          {timer.toString().padStart(3, '0')}
        </div>
      </div>

      {/* Grid */}
      <div className="border-2 border-inset border-[#7b7b7b] grid grid-cols-10">
        {grid.map((row, r) => row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            onClick={() => revealCell(r, c)}
            onContextMenu={(e) => toggleFlag(e, r, c)}
            className={`w-6 h-6 flex items-center justify-center text-xs font-bold cursor-default
              ${cell.revealed 
                ? 'bg-[#bdbdbd] border border-gray-400' 
                : 'bg-[#bdbdbd] border-2 border-t-white border-l-white border-r-[#7b7b7b] border-b-[#7b7b7b] active:border-none active:bg-gray-400'
              }
            `}
          >
            {cell.revealed ? (
              cell.value === 'M' ? '💣' : (cell.value || '')
            ) : cell.flagged ? '🚩' : ''}
            <span className={cell.revealed && typeof cell.value === 'number' ? colors[cell.value] : ''}>
              {cell.revealed && typeof cell.value === 'number' && cell.value > 0 ? cell.value : ''}
            </span>
          </div>
        )))}
      </div>

      <style>{`
        .border-inset { border-top-color: #7b7b7b; border-left-color: #7b7b7b; border-right-color: #fff; border-bottom-color: #fff; }
        .border-outset { border-top-color: #fff; border-left-color: #fff; border-right-color: #7b7b7b; border-bottom-color: #7b7b7b; }
      `}</style>
    </div>
  );
};
