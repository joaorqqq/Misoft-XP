
import React, { useState, useEffect, useRef } from 'react';

export const Termux: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [lines, setLines] = useState<string[]>([
    'Welcome to Termux!',
    'Working on Android? Type "gh-deploy" for help with GitHub Pages.',
    'Type "help" to see available commands.',
    ''
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const mockFS: Record<string, string[]> = {
    '/': ['bin', 'etc', 'home', 'usr', 'var'],
    '/bin': ['ls', 'cd', 'pwd', 'echo', 'clear', 'sh', 'bash', 'pkg', 'npm'],
    '/etc': ['passwd', 'hosts', 'hostname', 'network'],
    '/home': ['user'],
    '/home/user': ['documents', 'downloads', 'mxp-work-project', 'README.txt'],
    '/home/user/mxp-work-project': ['src', 'public', 'package.json', 'index.html', 'vite.config.ts'],
    '/usr': ['local', 'bin', 'lib'],
    '/var': ['log', 'mail']
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const rawInput = input.trim();
    if (!rawInput) {
      setLines(prev => [...prev, `${currentPath} $ `]);
      setInput('');
      return;
    }

    const parts = rawInput.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    let response: string | string[] = '';

    switch (cmd) {
      case 'gh-deploy':
        response = [
          '--- GUIA DE DEPLOY (TELA PRETA) ---',
          '1. No Termux Real: pkg install nodejs git',
          '2. No seu projeto: npm install',
          '3. Execute: npm run build',
          '4. IMPORTANTE: Suba a pasta "dist" gerada para o GitHub.',
          'Arquivos .tsx não abrem direto no navegador!',
          '-----------------------------------'
        ];
        break;
      case 'pkg':
        if (args[0] === 'install') {
          response = [`Installing ${args[1]}...`, '100% complete.', `${args[1]} is now available.`];
        } else {
          response = 'Usage: pkg install <package_name>';
        }
        break;
      case 'npm':
        if (args[0] === 'run' && args[1] === 'build') {
          response = ['> mxp-work@1.0.0 build', '> vite build', 'transforming...', '✓ built in 1.2s', 'File "dist/index.html" created. Ready for GitHub Pages!'];
        } else if (args[0] === 'install') {
          response = ['added 142 packages in 4s', 'found 0 vulnerabilities'];
        } else {
          response = 'Try: npm install or npm run build';
        }
        break;
      case 'help':
        response = [
          'Available commands:',
          '  gh-deploy   - Tips for GitHub Pages deployment',
          '  npm build   - Simulate a project build',
          '  pkg install - Simulate installing a tool',
          '  ls [dir]    - List directory contents',
          '  cd <dir>    - Change current directory',
          '  pwd         - Print working directory',
          '  clear       - Clear screen',
          '  whoami      - Print current user'
        ];
        break;
      case 'pwd':
        response = currentPath;
        break;
      case 'clear':
        setLines([]);
        setInput('');
        return;
      case 'echo':
        response = args.join(' ');
        break;
      case 'whoami':
        response = 'u0_a145';
        break;
      case 'ls':
        const targetPath = args[0] || currentPath;
        const normalizedTarget = targetPath.startsWith('/') ? targetPath : 
          (currentPath === '/' ? `/${targetPath}` : `${currentPath}/${targetPath}`);
        response = mockFS[normalizedTarget]?.join('  ') || `ls: cannot access '${targetPath}': No such file or directory`;
        break;
      case 'cd':
        const dest = args[0];
        if (!dest || dest === '~') {
          setCurrentPath('/home/user');
        } else if (dest === '..') {
          const parent = currentPath.split('/').slice(0, -1).join('/') || '/';
          setCurrentPath(parent);
        } else {
          let newPath = dest.startsWith('/') ? dest : 
            (currentPath === '/' ? `/${dest}` : `${currentPath}/${dest}`);
          if (newPath.length > 1 && newPath.endsWith('/')) newPath = newPath.slice(0, -1);
          
          if (mockFS[newPath]) {
            setCurrentPath(newPath);
          } else {
            response = `cd: no such file or directory: ${dest}`;
          }
        }
        break;
      default:
        response = `sh: command not found: ${cmd}`;
    }

    const finalRes = Array.isArray(response) ? response : [response];
    setLines(prev => [...prev, `${currentPath} $ ${rawInput}`, ...finalRes.filter(l => l !== '')]);
    setInput('');
  };

  return (
    <div 
      className="h-full bg-black text-[#00FF00] font-mono p-2 text-sm overflow-y-auto xp-scrollbar cursor-text selection:bg-[#00FF00] selection:text-black"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="whitespace-pre-wrap leading-tight">
        {lines.join('\n')}
      </div>
      <form onSubmit={handleCommand} className="inline-flex w-full">
        <span className="mr-2 text-white">{currentPath} $</span>
        <input 
          ref={inputRef}
          autoFocus
          className="bg-transparent outline-none flex-1 text-[#00FF00] border-none p-0 m-0"
          value={input}
          onChange={e => setInput(e.target.value)}
          spellCheck={false}
          autoComplete="off"
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
};
