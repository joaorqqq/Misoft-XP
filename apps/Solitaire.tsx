
import React, { useState, useEffect } from 'react';

interface Card {
  id: string;
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: string;
  color: 'red' | 'black';
  faceUp: boolean;
}

const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const Solitaire: React.FC = () => {
  const [stacks, setStacks] = useState<Card[][]>([]);
  const [draggedCard, setDraggedCard] = useState<{cardId: string, fromStack: number} | null>(null);

  useEffect(() => {
    // Inicialização segura
    const deck: Card[] = [];
    SUITS.forEach(suit => {
      VALUES.forEach(value => {
        deck.push({
          id: `${suit}-${value}`,
          suit,
          value,
          color: (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black',
          faceUp: true
        });
      });
    });
    
    const shuffled = deck.sort(() => Math.random() - 0.5);
    const initialStacks: Card[][] = [[], [], [], [], [], [], []];
    for (let i = 0; i < 7; i++) {
      initialStacks[i] = shuffled.slice(i * 3, (i + 1) * 3);
    }
    setStacks(initialStacks);
  }, []);

  const handleDragStart = (cardId: string, fromStack: number) => {
    setDraggedCard({ cardId, fromStack });
  };

  const handleDrop = (toStackIdx: number) => {
    if (!draggedCard) return;
    const { cardId, fromStack } = draggedCard;
    if (fromStack === toStackIdx) return;

    setStacks(prev => {
      const next = prev.map(s => [...s]);
      const cardIndex = next[fromStack].findIndex(c => c.id === cardId);
      if (cardIndex === -1) return prev;
      
      const cardsToMove = next[fromStack].splice(cardIndex);
      next[toStackIdx] = [...next[toStackIdx], ...cardsToMove];
      return next;
    });
    setDraggedCard(null);
  };

  if (stacks.length === 0) return <div className="h-full bg-[#008000] flex items-center justify-center text-white">Carregando Baralho...</div>;

  return (
    <div className="h-full bg-[#008000] p-4 flex flex-col font-[Tahoma] overflow-hidden select-none">
      <div className="flex justify-between mb-8">
        <div className="flex gap-4">
           {SUITS.map(suit => (
             <div key={suit} className="w-16 h-24 border-2 border-white/20 rounded bg-black/10 flex items-center justify-center text-white/10 text-2xl">
               {suit === 'hearts' ? '♥' : suit === 'diamonds' ? '♦' : suit === 'clubs' ? '♣' : '♠'}
             </div>
           ))}
        </div>
        <div className="flex gap-4">
           <div className="w-16 h-24 bg-blue-800 border-2 border-white rounded shadow-lg relative cursor-pointer active:translate-y-1 transition-transform">
              <div className="absolute inset-2 border border-white/30 rounded-sm"></div>
           </div>
           <div className="w-16 h-24 border-2 border-white/10 rounded"></div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 justify-center">
        {stacks.map((stack, stackIdx) => (
          <div 
            key={stackIdx} 
            className="w-16 h-full min-h-[100px] border-t-2 border-transparent"
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(stackIdx)}
          >
            {stack.map((card, cardIdx) => (
              <div
                key={card.id}
                draggable
                onDragStart={() => handleDragStart(card.id, stackIdx)}
                className="w-16 h-24 bg-white rounded shadow-md border border-gray-300 flex flex-col p-1 relative cursor-grab active:cursor-grabbing transition-transform"
                style={{ 
                  marginTop: cardIdx === 0 ? 0 : -85,
                  zIndex: cardIdx,
                  color: card.color
                }}
              >
                <div className="text-[10px] font-bold leading-none">{card.value}</div>
                <div className="text-xs leading-none">{card.suit === 'hearts' ? '♥' : card.suit === 'diamonds' ? '♦' : card.suit === 'clubs' ? '♣' : '♠'}</div>
                <div className="flex-1 flex items-center justify-center text-2xl">
                   {card.suit === 'hearts' ? '♥' : card.suit === 'diamonds' ? '♦' : card.suit === 'clubs' ? '♣' : '♠'}
                </div>
              </div>
            ))}
            {stack.length === 0 && <div className="w-16 h-24 border-2 border-white/10 rounded bg-black/5"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};
