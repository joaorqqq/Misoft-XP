
import React, { useState, useRef, useEffect } from 'react';

export const CommandPrompt: React.FC = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [textColor, setTextColor] = useState('text-[#CCCCCC]');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [waitingForInput, setWaitingForInput] = useState<{ varName: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const DT_LOGO = [
    "  __  ____  _________  _      _____  ____  _  __",
    " |  \\/  \\ \\/ /  _ \\ \\ \\/ /   / / _ \\|  _ \\| |/ /",
    " | |\\/| |\\  /| |_) |\\  / /\\ / / | | | |_) | ' / ",
    " | |  | |/  \\|  __/ /  \\ V  V /| |_| |  _ <| . \\ ",
    " |_|  |_/_/\\_\\_|   /_/\\_\\_/\\_/  \\___/|_| \\_\\_|\\_\\",
    "",
    " MXP Work Terminal Edition v5.1 [Kernel 2026.XP]",
    " (C) Copyright 2025-2026 MXP Work Group.",
    ""
  ];

  useEffect(() => {
    setHistory([...DT_LOGO, "C:\\Documents and Settings\\Administrator>"]);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const colorMap: Record<string, string> = {
    '0': 'text-black', '1': 'text-blue-800', '2': 'text-green-700', '3': 'text-teal-600',
    '4': 'text-red-700', '5': 'text-purple-700', '6': 'text-yellow-600', '7': 'text-gray-300',
    '8': 'text-gray-500', '9': 'text-blue-500', 'a': 'text-green-400', 'b': 'text-teal-400',
    'c': 'text-red-400', 'd': 'text-purple-400', 'e': 'text-yellow-400', 'f': 'text-white'
  };

  const processLine = (text: string) => {
    let output = text;
    Object.entries(variables).forEach(([k, v]) => {
      output = output.replace(new RegExp(`%${k}%`, 'gi'), String(v));
    });
    return output;
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input.trim();
    
    if (waitingForInput) {
      setVariables(prev => ({ ...prev, [waitingForInput.varName]: raw }));
      setHistory(prev => [...prev, raw, "C:\\Documents and Settings\\Administrator>"]);
      setWaitingForInput(null);
      setInput('');
      return;
    }

    if (!raw) {
       setHistory(prev => [...prev, "C:\\Documents and Settings\\Administrator>"]);
       return;
    }

    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    let response: string | string[] = '';

    switch(cmd) {
      case 'help':
        response = "COMANDOS DISPONÍVEIS:\nCD, DIR, MKDIR, DEL, COPY, REN, IPCONFIG, PING, TASKLIST, TASKKILL, SYSTEMINFO, NETSTAT, SFC, SHUTDOWN, CHKDSK, FORMAT, XCOPY, FIND, ATTRIB, ASSOC, TASKMGR, REGEDIT, VER, CLS, TYPE, CIPHER, PATHPING, DRIVERQUERY, HELP, EXIT, ECHO, COLOR, SET, PAUSE, INPUT";
        break;
      case 'cls':
        setHistory(["C:\\Documents and Settings\\Administrator>"]); setInput(''); return;
      case 'ver':
        response = "Microsoft Windows XP [Versão 5.1.2600] - MXP Work Kernel";
        break;
      case 'echo':
        response = processLine(parts.slice(1).join(' '));
        break;
      case 'color':
        const code = parts[1]?.toLowerCase() || '07';
        const fgChar = code.length === 2 ? code[1] : code[0];
        if (colorMap[fgChar]) setTextColor(colorMap[fgChar]);
        else response = "Código de cor inválido.";
        break;
      case 'ipconfig':
        response = ["Configuração de IP do Windows", "", "Adaptador Ethernet Conexão Local:", "   Sufixo DNS: xp.mxpwork.io", "   Endereço IPv4: 192.168.1.15", "   Máscara de Sub-rede: 255.255.255.0", "   Gateway Padrão: 192.168.1.1"];
        break;
      case 'systeminfo':
        response = ["Nome do Host: XP-PROFESSIONAL", "SO: Microsoft Windows XP Professional", "Fabricante: MXP Work Group", "Processador: Intel(R) Core(TM) i9-2026XP", "Memória Física: 64.000 MB"];
        break;
      case 'set':
        if (parts[1] === '/p') {
          const varDef = parts.slice(2).join(' ');
          const [name, prompt] = varDef.split('=');
          if (name) {
            setWaitingForInput({ varName: name.trim() });
            setHistory(prev => [...prev, `C:\\Documents and Settings\\Administrator>${raw}`, prompt || '']);
            setInput('');
            return;
          }
        } else {
          const varArr = parts.slice(1).join(' ').split('=');
          if (varArr.length >= 2) {
            const name = varArr[0].trim();
            const val = varArr.slice(1).join('=').trim();
            setVariables(prev => ({ ...prev, [name]: val }));
          } else {
            response = "Uso: SET var=val ou SET /p var=prompt";
          }
        }
        break;
      case 'input':
        response = "Use o comando SET /p para receber inputs em scripts.";
        break;
      case 'pause':
        response = "Pressione ENTER para continuar . . .";
        break;
      case 'dir':
        response = ["O volume na unidade C é SYSTEM", "Número de série: MXP-2026-XP", "", "15/04/2026  14:00    <DIR>          WINDOWS", "15/04/2026  14:00    <DIR>          Documents", "15/04/2026  14:00    <DIR>          Program Files", "            3 Pasta(s) 512.000.000 bytes livres"];
        break;
      case 'ping':
        const target = parts[1] || 'google.com';
        response = [`Disparando contra ${target} com 32 bytes de dados:`, `Resposta de ${target}: bytes=32 tempo=12ms TTL=128`, `Resposta de ${target}: bytes=32 tempo=15ms TTL=128`, "", "Estatísticas do Ping: Enviados = 2, Recebidos = 2, Perdidos = 0"];
        break;
      case 'exit':
        response = "Terminal fechado com sucesso.";
        break;
      default:
        response = `'${cmd}' não é reconhecido como um comando interno ou externo.`;
    }

    const finalRes = Array.isArray(response) ? response : [response];
    setHistory(prev => [...prev, `C:\\Documents and Settings\\Administrator>${raw}`, ...finalRes, ""]);
    setInput('');
  };

  return (
    <div 
      className={`h-full bg-black ${textColor} font-mono p-1 text-[12px] overflow-y-auto xp-scrollbar cursor-text`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="whitespace-pre-wrap leading-[1.2]">
        {history.map((line, i) => <div key={i}>{line}</div>)}
      </div>
      <form onSubmit={handleCommand} className="flex gap-1">
        {!waitingForInput && <span>C:\Documents and Settings\Administrator&gt;</span>}
        <input 
          ref={inputRef}
          autoFocus
          className="bg-transparent outline-none flex-1 border-none p-0 m-0 text-inherit"
          value={input}
          onChange={e => setInput(e.target.value)}
          spellCheck={false}
          autoComplete="off"
        />
      </form>
      <div ref={bottomRef} className="h-4" />
    </div>
  );
};