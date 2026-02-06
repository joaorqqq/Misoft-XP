
import React, { useState, useEffect } from 'react';
import { XP_SOUNDS, playSound, unlockAudio } from '../utils/sounds';

interface User {
  username: string;
  password: string;
  avatar: string;
  isAdmin?: boolean;
}

interface LoginScreenProps {
  onLogin: (username: string, wasAdminCode?: boolean) => void;
}

const XP_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Windows_XP_Logo.svg";
const TEAM_LOGO_URL = "https://i.postimg.cc/cHJGzv01/Picsart-26-02-06-15-16-00-966.jpg";
const PIX_QR_URL = "https://i.postimg.cc/j5qncT92/IMG_20260205_WA0004.jpg";
const SUPPORT_EMAIL = "mxpteamsuport@gmail.com";
const DISCORD_URL = "https://discord.gg/e2ty8RQyu";

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isClassicLogon, setIsClassicLogon] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  
  const [classicUser, setClassicUser] = useState('');
  const [classicPass, setClassicPass] = useState('');
  
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const ADMIN_SECRET = 'mxpteamsuport@gmail.comDashpainelCode';

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('xp_users') || '[]');
    setUsers(saved);
    if (saved.length > 0) setSelectedUser(saved[0]);
    
    const firstClick = () => {
      unlockAudio();
      window.removeEventListener('click', firstClick);
    };
    window.addEventListener('click', firstClick);
    return () => window.removeEventListener('click', firstClick);
  }, []);

  const performLogin = (username: string, isAdmin: boolean = false) => {
    setIsLoggingIn(true);
    unlockAudio();
    playSound(XP_SOUNDS.STARTUP, 1.0);
    setTimeout(() => {
      onLogin(username, isAdmin);
    }, 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;
    setError('');
    const trimmedPass = password.trim();
    if (trimmedPass === ADMIN_SECRET || trimmedPass.toUpperCase() === 'ADM' || trimmedPass === '777444') {
      performLogin(selectedUser?.username || 'Administrator', true);
      return;
    }
    if (selectedUser && trimmedPass === selectedUser.password) {
      performLogin(selectedUser.username, selectedUser.isAdmin);
    } else {
      playSound(XP_SOUNDS.ERROR, 0.7);
      setError('Senha incorreta.');
      setPassword('');
    }
  };

  const copySupport = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    playSound(XP_SOUNDS.NOTIFY);
    alert("E-mail de suporte copiado!");
  };

  return (
    <div className={`fixed inset-0 bg-[#5A7EDC] flex flex-col font-[Tahoma] z-[200000] overflow-hidden transition-all duration-1000 ${isLoggingIn ? 'scale-110 opacity-0' : 'opacity-100'}`}>
      <div className="h-[10px] bg-[#003399]"></div>
      <div className="h-[110px] bg-gradient-to-b from-[#003399] to-[#5A7EDC] border-b-2 border-white/20 flex justify-end items-center px-10">
      </div>
      
      <div className="flex-1 flex flex-col sm:flex-row relative items-center justify-center">
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white/40 to-transparent hidden sm:block"></div>
        
        <div className="w-full sm:w-1/2 flex items-center justify-center sm:justify-end sm:pr-16 mb-8 sm:mb-0">
          <img 
            src={XP_LOGO_URL} 
            className="w-48 sm:w-80 drop-shadow-xl" 
            alt="Windows XP Logo" 
          />
        </div>

        <div className="w-full sm:w-1/2 flex flex-col justify-center items-center sm:items-start sm:pl-16">
          {isClassicLogon ? (
            <form onSubmit={(e) => { e.preventDefault(); performLogin(classicUser); }} className="bg-[#D4D0C8] p-1 border-2 border-white border-r-[#808080] border-b-[#808080] w-[300px] shadow-2xl animate-xp-open text-black">
               <div className="bg-[#0058e4] xp-blue-gradient p-1 text-white text-xs font-bold mb-4">Logon no Windows</div>
               <div className="p-4 space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold">Usuário:</label>
                    <input autoFocus className="border border-gray-500 p-1 text-sm outline-none" value={classicUser} onChange={e => setClassicUser(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold">Senha:</label>
                    <input type="password" className="border border-gray-500 p-1 text-sm outline-none" value={classicPass} onChange={e => setClassicPass(e.target.value)} />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="submit" className="bg-[#D4D0C8] border-2 border-white border-r-[#808080] border-b-[#808080] px-4 py-1 text-xs font-bold">OK</button>
                    <button type="button" onClick={() => setIsClassicLogon(false)} className="bg-[#D4D0C8] border-2 border-white border-r-[#808080] border-b-[#808080] px-4 py-1 text-xs">Cancelar</button>
                  </div>
               </div>
            </form>
          ) : !isRegistering ? (
            <div className="max-w-[420px] w-full px-4 sm:px-0 space-y-6">
              <h1 className="text-white text-2xl sm:text-4xl font-light text-center sm:text-left">Para começar, clique no seu nome</h1>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 no-scrollbar border-y border-white/10 py-4">
                {users.map(u => (
                  <div 
                    key={u.username}
                    onClick={() => { setSelectedUser(u); unlockAudio(); }}
                    className={`flex items-center gap-4 p-2 cursor-pointer rounded border-2 transition-all duration-300 ${selectedUser?.username === u.username ? 'bg-[#3b68c0] border-yellow-400 translate-x-2 shadow-2xl scale-105' : 'border-transparent hover:bg-white/10'}`}
                  >
                    <img src={u.avatar} className="w-14 h-14 rounded border-2 border-white/60" alt="" />
                    <div className="flex-1 text-white">
                      <span className="font-bold text-xl">{u.username}</span>
                      {selectedUser?.username === u.username && (
                        <form onSubmit={handleLogin} className="mt-2 flex gap-1 items-center animate-fadeIn">
                          <input 
                            type="password" autoFocus value={password} 
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-2 py-1 text-black text-sm outline-none rounded-sm" 
                            placeholder="Senha"
                          />
                          <button type="submit" className="bg-green-600 px-4 py-1 font-bold rounded-sm">➜</button>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
                {users.length === 0 && <div className="text-white/60 text-center py-4 italic text-sm">Nenhum usuário criado.</div>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsRegistering(true)} className="bg-[#449244] text-white px-5 py-2 font-bold shadow-lg text-xs hover:brightness-110">NOVA CONTA</button>
                <button onClick={() => setIsClassicLogon(true)} className="bg-[#c0c0c0] text-black px-5 py-2 font-bold shadow-lg text-xs border-2 border-white border-r-gray-600 border-b-gray-600">LOGON CLÁSSICO</button>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => {
              e.preventDefault();
              const newUser = { username: regUsername, password: regPassword, avatar: `https://picsum.photos/seed/${regUsername}/64` };
              const updated = [...users, newUser];
              localStorage.setItem('xp_users', JSON.stringify(updated));
              setUsers(updated);
              setIsRegistering(false);
              setSelectedUser(newUser);
              playSound(XP_SOUNDS.NOTIFY);
            }} className="bg-[#ece9d8] p-6 rounded border-2 border-white border-r-gray-600 border-b-gray-600 shadow-2xl w-[320px] space-y-4 text-black animate-xp-open">
               <h3 className="text-blue-900 text-lg font-bold border-b border-gray-400 pb-2">Registrar Usuário</h3>
               <input className="w-full p-2 text-sm border border-gray-400" placeholder="Nome" value={regUsername} onChange={e => setRegUsername(e.target.value)} required />
               <input type="password" className="w-full p-2 text-sm border border-gray-400" placeholder="Senha" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
               <div className="flex gap-2">
                 <button type="submit" className="bg-green-600 text-white flex-1 py-2 font-bold">Criar</button>
                 <button type="button" onClick={() => setIsRegistering(false)} className="bg-gray-300 text-black px-4 py-2 font-bold">Voltar</button>
               </div>
            </form>
          )}
        </div>
      </div>
      
      {/* Botões Inferiores */}
      <div className="h-[100px] bg-gradient-to-t from-[#003399] to-[#5A7EDC] border-t-2 border-white/20 flex items-center justify-between px-10">
        <button className="text-white font-bold flex items-center gap-2 group" onClick={() => { unlockAudio(); playSound(XP_SOUNDS.SHUTDOWN); setTimeout(() => window.location.reload(), 2000); }}>
          <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center border-2 border-white shadow-xl group-hover:brightness-110">⏻</div>
          Desligar
        </button>

        <button 
          onClick={() => { setShowCredits(true); playSound(XP_SOUNDS.CLICK); }}
          className="text-white font-bold flex items-center gap-2 group"
        >
          <span className="group-hover:underline">Créditos & Apoio</span>
          <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center border-2 border-white shadow-xl group-hover:brightness-110 text-xl">?</div>
        </button>
      </div>

      {/* Modal de Créditos & Doação */}
      {showCredits && (
        <div className="fixed inset-0 z-[300000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-[#ece9d8] border-2 border-white border-r-gray-600 border-b-gray-600 shadow-2xl w-full max-w-[450px] animate-xp-open flex flex-col text-black">
            <div className="bg-[#0058e4] xp-blue-gradient p-2 text-white flex justify-between items-center">
              <span className="font-bold text-xs flex items-center gap-2">
                <img src="https://win98icons.alexmeub.com/icons/png/help_book_computer-4.png" className="w-4 h-4" alt="" />
                Sobre o MXP Work Edition
              </span>
              <button onClick={() => setShowCredits(false)} className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-xs hover:bg-red-700">×</button>
            </div>
            
            <div className="p-6 bg-white m-2 border border-gray-400 overflow-y-auto max-h-[70vh] xp-scrollbar">
              <div className="flex flex-col items-center mb-6 gap-3">
                <img src={XP_LOGO_URL} className="w-40 mb-2" alt="" />
                <div className="flex flex-col items-center">
                   <img src={TEAM_LOGO_URL} className="w-16 h-16 rounded-full border-2 border-blue-600 shadow-lg object-cover" alt="MXP Logo" />
                   <span className="text-[9px] font-bold text-blue-900 uppercase">MXP Work Group</span>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold border-b border-blue-600 text-blue-800 mb-1">EQUIPE</h4>
                  <p>Desenvolvimento: <strong>MXP Work Team</strong></p>
                  <p>Motor: <strong>MXP Engine XP</strong></p>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 p-3 rounded text-center">
                  <p className="font-bold text-indigo-900 mb-2">NOSSA COMUNIDADE:</p>
                  <a 
                    href={DISCORD_URL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex bg-[#5865F2] text-white px-4 py-1.5 rounded font-bold text-[10px] shadow hover:bg-[#4752C4] transition-colors items-center gap-2"
                  >
                    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111370.png" className="w-3 h-3 invert" alt="" />
                    ENTRAR NO DISCORD
                  </a>
                </div>

                <div>
                  <h4 className="font-bold border-b border-yellow-600 text-yellow-800 mb-1 uppercase">Apoie o Projeto (Donation)</h4>
                  <div className="bg-yellow-50 border border-yellow-300 p-4 rounded text-center space-y-3">
                    <p className="font-bold text-red-700">ESCANEIE PARA DOAR (PIX):</p>
                    <img src={PIX_QR_URL} className="w-32 h-32 mx-auto border-2 border-white shadow-md bg-white" alt="PIX QR Code" />
                    
                    <div className="h-px bg-yellow-200"></div>
                    
                    <div>
                      <p className="font-bold text-blue-800 text-[10px]">E-MAIL DE SUPORTE:</p>
                      <code className="block bg-white border border-gray-300 p-1 mb-2 font-mono text-[11px] break-all">{SUPPORT_EMAIL}</code>
                      <button 
                        onClick={copySupport}
                        className="bg-[#D4D0C8] border-2 border-white border-r-[#808080] border-b-[#808080] px-3 py-1 font-bold text-[9px] active:translate-y-px"
                      >
                        COPIAR SUPORTE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 flex justify-end">
              <button 
                onClick={() => setShowCredits(false)}
                className="bg-[#D4D0C8] border-2 border-white border-r-[#808080] border-b-[#808080] px-6 py-1 text-xs font-bold active:translate-y-px"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
