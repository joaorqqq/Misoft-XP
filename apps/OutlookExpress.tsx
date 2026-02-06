
import React, { useState } from 'react';

interface Email {
  id: number;
  from: string;
  subject: string;
  date: string;
  body: string;
  read: boolean;
}

const INITIAL_EMAILS: Email[] = [
  {
    id: 1,
    from: "MisoftXP Team",
    subject: "Novo Sistema GitWeb Ativado!",
    date: "16/04/2026 09:00",
    body: "Olá Administrador,\n\nAcabamos de implantar o GitWeb Publisher. Agora você pode criar e publicar conteúdo HTML diretamente no sistema.\n\nComo usar:\n1. Abra o GitWeb Publisher no Desktop.\n2. Escreva seu código HTML.\n3. Clique em Commit & Publish.\n4. Visualize o resultado no Internet Explorer em http://gitweb.local/home.\n\nAtenciosamente,\nEquipe de Infraestrutura",
    read: false
  },
  {
    id: 2,
    from: "MisoftXP Team",
    subject: "Bem-vindo ao MisoftXP 2026 Professional",
    date: "15/04/2026 10:00",
    body: "Olá Administrador,\n\nParabéns por ativar o MisoftXP 2026. Este sistema foi projetado para a nova economia Peer-to-Peer.\n\nLembre-se de manter sua assistente Luna ativa para maximizar seus ganhos de XPCoins.\n\nAtenciosamente,\nEquipe Misoft",
    read: true
  },
  {
    id: 3,
    from: "gn375294@gmail.com",
    subject: "Código de Verificação de Segurança",
    date: "15/04/2026 10:05",
    body: "Seu código de verificação para o Painel Administrativo é: 777-444.\n\nNão compartilhe este código com ninguém.",
    read: true
  }
];

export const OutlookExpress: React.FC = () => {
  const [emails, setEmails] = useState(INITIAL_EMAILS);
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const selectedEmail = emails.find(e => e.id === selectedId);

  const markAsRead = (id: number) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
    setSelectedId(id);
  };

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] font-[Tahoma] overflow-hidden select-none">
      {/* Toolbar */}
      <div className="flex items-center gap-4 p-2 bg-[#ece9d8] border-b border-gray-400">
        <button className="flex flex-col items-center opacity-60">
          <img src="https://win98icons.alexmeub.com/icons/png/outlook_express-0.png" className="w-6 h-6" alt="" />
          <span className="text-[10px]">Create Mail</span>
        </button>
        <button className="flex flex-col items-center">
          <img src="https://win98icons.alexmeub.com/icons/png/message_envelope_open-0.png" className="w-6 h-6" alt="" />
          <span className="text-[10px]">Send/Recv</span>
        </button>
        <div className="h-8 w-px bg-gray-400"></div>
        <button className="flex flex-col items-center opacity-60">
          <img src="https://win98icons.alexmeub.com/icons/png/address_book_card-0.png" className="w-6 h-6" alt="" />
          <span className="text-[10px]">Addresses</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Folders */}
        <div className="w-40 bg-white border-r border-gray-400 flex flex-col p-2 text-xs">
          <div className="font-bold mb-2 flex items-center gap-1">
             <img src="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png" className="w-3 h-3" alt="" />
             Outlook Express
          </div>
          <div className="pl-4 space-y-1">
            <div className="bg-[#0A246A] text-white px-1">Local Folders</div>
            <div className="pl-2 space-y-1 mt-1">
               <div className="flex items-center gap-1 font-bold">
                 <img src="https://win98icons.alexmeub.com/icons/png/message_envelope-0.png" className="w-3 h-3" alt="" />
                 Inbox ({emails.filter(e => !e.read).length})
               </div>
               <div className="flex items-center gap-1 opacity-50">Sent Items</div>
               <div className="flex items-center gap-1 opacity-50">Deleted Items</div>
               <div className="flex items-center gap-1 opacity-50">Drafts</div>
            </div>
          </div>
        </div>

        {/* Email List and View */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* List */}
          <div className="h-1/2 bg-white overflow-y-auto border-b border-gray-400 xp-scrollbar">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead className="bg-[#ece9d8] sticky top-0 shadow-sm">
                <tr>
                  <th className="border-r border-gray-300 px-1 font-normal">!</th>
                  <th className="border-r border-gray-300 px-1 font-normal">From</th>
                  <th className="border-r border-gray-300 px-1 font-normal">Subject</th>
                  <th className="px-1 font-normal">Received</th>
                </tr>
              </thead>
              <tbody>
                {emails.map(email => (
                  <tr 
                    key={email.id} 
                    onClick={() => markAsRead(email.id)}
                    className={`cursor-default ${selectedId === email.id ? 'bg-[#0A246A] text-white' : 'hover:bg-blue-100'} ${!email.read ? 'font-bold' : ''}`}
                  >
                    <td className="px-1 border-r border-gray-100">
                      {!email.read && <img src="https://win98icons.alexmeub.com/icons/png/message_envelope-0.png" className="w-3 h-3" alt="" />}
                    </td>
                    <td className="px-1 border-r border-gray-100 truncate max-w-[100px]">{email.from}</td>
                    <td className="px-1 border-r border-gray-100 truncate">{email.subject}</td>
                    <td className="px-1 truncate">{email.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View */}
          <div className="flex-1 bg-white p-4 overflow-y-auto xp-scrollbar">
            {selectedEmail ? (
              <div className="space-y-2">
                <div className="text-xs border-b border-gray-200 pb-2">
                  <div className="flex gap-2"><span className="text-gray-500 w-12">From:</span> <strong>{selectedEmail.from}</strong></div>
                  <div className="flex gap-2"><span className="text-gray-500 w-12">Date:</span> {selectedEmail.date}</div>
                  <div className="flex gap-2"><span className="text-gray-500 w-12">Subject:</span> <strong>{selectedEmail.subject}</strong></div>
                </div>
                <div className="text-sm whitespace-pre-wrap pt-2 font-[Arial]">
                  {selectedEmail.body}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic text-xs">No message selected.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
