
import React, { useState, useEffect } from 'react';

interface NotepadProps {
  initialText?: string;
}

export const Notepad: React.FC<NotepadProps> = ({ initialText }) => {
  const [text, setText] = useState(initialText || '');
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (!initialText) {
      const saved = localStorage.getItem('xp_notepad_content');
      if (saved) setText(saved);
    }
  }, [initialText]);

  const handleSave = () => {
    localStorage.setItem('xp_notepad_content', text);
    setIsModified(false);
    alert('Documento salvo com sucesso!');
  };

  const handleNew = () => {
    if (isModified && !confirm('Deseja descartar as alterações?')) return;
    setText('');
    setIsModified(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setIsModified(true);
  };

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] font-[Tahoma] select-none">
      {/* Menu Bar */}
      <div className="flex gap-1 p-0.5 text-[11px] border-b border-gray-300 bg-[#ece9d8]">
        <div className="relative group">
          <button className="hover:bg-[#0a246a] hover:text-white px-2 py-0.5 cursor-default">Arquivo</button>
          <div className="hidden group-hover:block absolute left-0 top-full w-40 bg-[#ece9d8] border border-gray-400 shadow-md z-50">
            <div onClick={handleNew} className="px-4 py-1 hover:bg-[#0a246a] hover:text-white cursor-default">Novo</div>
            <div onClick={handleSave} className="px-4 py-1 hover:bg-[#0a246a] hover:text-white cursor-default">Salvar</div>
            <div className="h-px bg-gray-400 my-1 mx-1"></div>
            <div className="px-4 py-1 opacity-50 cursor-default">Imprimir...</div>
            <div className="px-4 py-1 hover:bg-[#0a246a] hover:text-white cursor-default">Sair</div>
          </div>
        </div>
        <button className="hover:bg-[#0a246a] hover:text-white px-2 py-0.5 cursor-default">Editar</button>
        <button className="hover:bg-[#0a246a] hover:text-white px-2 py-0.5 cursor-default">Formatar</button>
        <button className="hover:bg-[#0a246a] hover:text-white px-2 py-0.5 cursor-default">Exibir</button>
        <button className="hover:bg-[#0a246a] hover:text-white px-2 py-0.5 cursor-default">Ajuda</button>
      </div>

      {/* Editor Area */}
      <textarea
        className="flex-1 p-1 outline-none resize-none font-mono text-[14px] xp-scrollbar leading-tight bg-white"
        value={text}
        onChange={handleChange}
        spellCheck={false}
      />
      
      {/* Status Bar */}
      <div className="h-5 bg-[#ece9d8] border-t border-gray-300 text-[10px] flex items-center px-2 text-gray-600">
        <div className="flex-1">Pronto</div>
        <div className="border-l border-gray-400 px-4">Lin 1, Col 1</div>
      </div>
    </div>
  );
};
