
import React, { useState } from 'react';

export const MSNMessenger: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState<{from: string, text: string}[]>([]);
  const [input, setInput] = useState('');

  const handleLogin = () => setIsLoggedIn(true);
  const sendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: 'You', text: input }, { from: 'NudgeBot', text: 'Stop nudging me!' }]);
    setInput('');
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#f1f1f1] p-8">
        <img src="https://win98icons.alexmeub.com/icons/png/msn_messenger-0.png" className="w-16 h-16 mb-4" alt="MSN" />
        <h2 className="text-[#003399] font-bold text-lg mb-4">MSN Messenger</h2>
        <input className="border border-gray-400 p-1 mb-2 w-full max-w-[200px]" placeholder="Email address" defaultValue="xp_user@hotmail.com" />
        <input className="border border-gray-400 p-1 mb-4 w-full max-w-[200px]" type="password" placeholder="Password" defaultValue="password" />
        <button onClick={handleLogin} className="bg-[#ffcc00] border border-gray-600 px-6 py-1 font-bold shadow-sm">Sign In</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#eef3fa]">
      <div className="bg-white p-2 border-b border-gray-300 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-400 rounded-sm border border-gray-400 overflow-hidden">
           <img src="https://picsum.photos/40" alt="Avatar" />
        </div>
        <div>
          <div className="font-bold text-[12px]">Administrator (Online)</div>
          <div className="text-[10px] text-gray-500 italic">"Feeling nostalgic..."</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-white m-2 border border-gray-300 rounded shadow-inner">
        {messages.map((m, i) => (
          <div key={i} className="text-[12px]">
            <span className={m.from === 'You' ? 'text-blue-700 font-bold' : 'text-red-600 font-bold'}>{m.from} says:</span>
            <span className="ml-2">{m.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMsg} className="p-2 flex gap-1">
        <input 
          className="flex-1 border border-gray-400 px-2 py-1 text-[12px] outline-none" 
          value={input} 
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="bg-gray-200 border border-gray-500 px-3 text-[12px] font-bold">Send</button>
      </form>
    </div>
  );
};
