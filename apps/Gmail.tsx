
import React, { useState } from 'react';

export const Gmail: React.FC = () => {
  const [activeMail, setActiveMail] = useState<number | null>(null);

  const mails = [
    { id: 1, from: "Larry Page", subject: "Sua conta Gmail foi ativada!", date: "1 Abril 2004", body: "Bem-vindo ao Gmail! Você faz parte de um grupo exclusivo de testadores beta. Aproveite seu 1GB de armazenamento gratuito." },
    { id: 2, from: "Google Team", subject: "Dicas para o Gmail", date: "2 Abril 2004", body: "Use a busca poderosa do Google para encontrar seus e-mails instantaneamente. Não use pastas, use marcadores!" }
  ];

  return (
    <div className="h-full bg-white flex flex-col font-[Arial] text-sm overflow-hidden select-none">
      {/* Header Estilo 2004 */}
      <div className="bg-[#f1f3f4] p-2 border-b border-gray-300 flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="text-xl font-bold flex">
             <span className="text-blue-600">G</span>
             <span className="text-red-600">o</span>
             <span className="text-yellow-500">o</span>
             <span className="text-blue-600">g</span>
             <span className="text-green-600">l</span>
             <span className="text-red-600">e</span>
             <span className="ml-1 text-gray-500">Mail</span>
             <span className="ml-1 text-[10px] text-red-500 font-normal">BETA</span>
           </div>
        </div>
        <div className="text-xs">
          <span className="font-bold">admin@gmail.com</span> | <span className="text-blue-600 underline">Configurações</span> | <span className="text-blue-600 underline">Sair</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-40 p-4 border-r border-gray-200 bg-white">
          <button className="w-full bg-blue-600 text-white font-bold py-1 rounded mb-4 shadow">Escrever</button>
          <ul className="space-y-2 text-[13px]">
            <li className="font-bold text-red-600 flex justify-between">Entrada <span>(2)</span></li>
            <li className="text-blue-800 hover:underline cursor-pointer">Com estrela</li>
            <li className="text-blue-800 hover:underline cursor-pointer">Enviados</li>
            <li className="text-blue-800 hover:underline cursor-pointer">Rascunhos</li>
            <li className="text-blue-800 hover:underline cursor-pointer">Spam</li>
          </ul>
        </div>

        {/* Mail Content */}
        <div className="flex-1 flex flex-col bg-white overflow-y-auto">
          {activeMail === null ? (
            <div className="p-2">
              <div className="flex bg-[#e8f0fe] p-1 border-b border-gray-200 font-bold text-xs uppercase text-gray-600">
                <div className="w-8"></div>
                <div className="w-32">Remetente</div>
                <div className="flex-1">Assunto</div>
                <div className="w-24">Data</div>
              </div>
              {mails.map(m => (
                <div 
                  key={m.id} 
                  onClick={() => setActiveMail(m.id)}
                  className="flex p-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer text-xs transition-colors"
                >
                  <div className="w-8">☐</div>
                  <div className="w-32 font-bold">{m.from}</div>
                  <div className="flex-1 truncate">{m.subject}</div>
                  <div className="w-24 text-gray-500">{m.date}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6">
              <button onClick={() => setActiveMail(null)} className="text-blue-600 underline text-xs mb-4">« Voltar para Entrada</button>
              <h2 className="text-xl font-bold mb-2">{mails.find(m => m.id === activeMail)?.subject}</h2>
              <div className="text-xs text-gray-500 mb-4 border-b border-gray-200 pb-2">
                De: <span className="font-bold text-black">{mails.find(m => m.id === activeMail)?.from}</span>
              </div>
              <div className="text-[14px] leading-relaxed">
                {mails.find(m => m.id === activeMail)?.body}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-1 bg-[#f1f3f4] text-[10px] text-gray-500 text-center">
        Você está usando 0MB (0%) dos seus 1024MB.
      </div>
    </div>
  );
};
