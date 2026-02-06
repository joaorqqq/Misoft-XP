
import React, { useState, useEffect } from 'react';
import { User } from '../types';

export const AdmPainel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [siteOffline, setSiteOffline] = useState(false);
  const [tempKey, setTempKey] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const savedUsers = JSON.parse(localStorage.getItem('xp_users') || '[]');
    setUsers(savedUsers);
    setSiteOffline(localStorage.getItem('xp_site_offline') === 'true');
  };

  const toggleBan = (username: string) => {
    const updated = users.map(u => u.username === username ? { ...u, isBanned: !u.isBanned } : u);
    saveUsers(updated);
  };

  const toggleAdmin = (username: string) => {
    const updated = users.map(u => u.username === username ? { ...u, isAdmin: !u.isAdmin } : u);
    saveUsers(updated);
    alert(`Status de ADM alterado para ${username}. O app aparecerá no desktop dele agora.`);
  };

  const generateTempKey = (username: string) => {
    const key = Math.random().toString(36).substring(2, 8).toUpperCase();
    setTempKey(key);
    alert(`Chave Temporária para ${username}: ${key}\nEnvie para mxpteamsuport@gmail.com`);
  };

  const saveUsers = (updated: User[]) => {
    localStorage.setItem('xp_users', JSON.stringify(updated));
    setUsers(updated);
  };

  const toggleSiteStatus = () => {
    const nextStatus = !siteOffline;
    localStorage.setItem('xp_site_offline', String(nextStatus));
    setSiteOffline(nextStatus);
    alert(nextStatus ? "SITE OFFLINE - Apenas ADMs podem entrar." : "SITE ONLINE - Todos podem entrar.");
  };

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] font-[Tahoma] overflow-hidden select-none">
      <div className="bg-[#0058e4] p-3 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <img src="https://win98icons.alexmeub.com/icons/png/control_panel-4.png" className="w-6 h-6" alt="" />
          <span className="font-bold">Painel de Administração MXP Work</span>
        </div>
        <button 
          onClick={toggleSiteStatus}
          className={`px-4 py-1 rounded border font-bold text-xs shadow-sm ${siteOffline ? 'bg-red-600 border-red-800' : 'bg-green-600 border-green-800'}`}
        >
          {siteOffline ? 'VOLTAR SITE AO AR' : 'TIRAR SITE DO AR'}
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto xp-scrollbar space-y-4">
        <div className="bg-white border-2 border-inset border-gray-400 p-2">
          <h3 className="text-sm font-bold border-b border-gray-200 pb-2 mb-2 flex items-center gap-2">
            <img src="https://win98icons.alexmeub.com/icons/png/users-0.png" className="w-4 h-4" alt="" />
            Usuários do Sistema
          </h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border border-gray-300">Usuário</th>
                <th className="p-2 border border-gray-300">Status</th>
                <th className="p-2 border border-gray-300">Restrições</th>
                <th className="p-2 border border-gray-300">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.username} className={user.isBanned ? 'bg-red-50' : 'bg-white'}>
                  <td className="p-2 border border-gray-300 flex items-center gap-2">
                    <img src={user.avatar} className="w-6 h-6 rounded border border-gray-300" alt="" />
                    <span className="font-bold">{user.username} {user.isAdmin && <span className="text-blue-600">[ADM]</span>}</span>
                  </td>
                  <td className="p-2 border border-gray-300">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${user.isBanned ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                      {user.isBanned ? 'BANIDO' : 'ATIVO'}
                    </span>
                  </td>
                  <td className="p-2 border border-gray-300">
                    <div className="flex gap-1">
                       <span className="text-[9px] bg-blue-100 text-blue-800 px-1 border border-blue-200">MXP Asst</span>
                       <span className="text-[9px] bg-red-100 text-red-800 px-1 border border-red-200">ByeDowel</span>
                    </div>
                  </td>
                  <td className="p-2 border border-gray-300">
                    <div className="flex gap-1 flex-wrap">
                      <button onClick={() => toggleBan(user.username)} className="bg-gray-200 border border-gray-400 px-2 py-0.5 hover:bg-gray-300">{user.isBanned ? 'Desbanir' : 'Banir'}</button>
                      <button onClick={() => toggleAdmin(user.username)} className="bg-blue-600 text-white border border-blue-800 px-2 py-0.5 hover:bg-blue-700">Dar ADM</button>
                      <button onClick={() => generateTempKey(user.username)} className="bg-yellow-400 border border-yellow-600 px-2 py-0.5 hover:bg-yellow-500">Reset Password</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded text-xs text-blue-900 leading-relaxed shadow-sm">
           <strong>Log do Sistema:</strong><br/>
           - ByeDowel AntiBackdoor monitorando kernel...<br/>
           - MXP Work Peer Sync OK.<br/>
           - Contato Administrativo: <span className="font-bold underline">mxpteamsuport@gmail.com</span>
        </div>
      </div>

      {tempKey && (
        <div className="bg-[#FFFFE1] p-2 text-center text-[11px] border-t border-gray-400 font-bold">
          ULTIMA CHAVE GERADA: <span className="text-red-600 tracking-widest">{tempKey}</span>
        </div>
      )}
    </div>
  );
};