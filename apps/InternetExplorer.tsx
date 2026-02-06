
import React, { useState, useEffect } from 'react';

interface PublishedPage {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  url: string;
}

interface InternetExplorerProps {
  initialUrl?: string;
}

export const InternetExplorer: React.FC<InternetExplorerProps> = ({ initialUrl }) => {
  const [url, setUrl] = useState(initialUrl || 'http://portal.xp/home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [publishedContent, setPublishedContent] = useState<PublishedPage[]>([]);

  useEffect(() => {
    const loadPublished = () => {
      const saved = JSON.parse(localStorage.getItem('gitweb_published') || '[]');
      setPublishedContent(saved);
    };
    loadPublished();
    window.addEventListener('storage', loadPublished);
    return () => window.removeEventListener('storage', loadPublished);
  }, []);

  const handleGo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(false);
    if (!url.startsWith('http')) setUrl('http://' + url);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setUrl(`search://?q=${encodeURIComponent(searchQuery)}`);
  };

  const match = publishedContent.find(p => p.url === url);

  const renderClassicSite = () => {
    if (isSearching || url.startsWith('search://')) {
      return (
        <div className="bg-white p-6 font-[Arial]">
          <div className="flex items-center gap-4 mb-6 border-b pb-4">
             <div className="text-3xl font-bold flex">
                <span className="text-blue-600">G</span><span className="text-red-600">o</span><span className="text-yellow-500">o</span><span className="text-blue-600">g</span><span className="text-green-600">l</span><span className="text-red-600">e</span>
             </div>
             <div className="flex-1 max-w-md">
                <div className="flex border border-gray-300 shadow-sm">
                   <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 px-2 py-1 outline-none" />
                   <button className="bg-gray-100 px-4 border-l border-gray-300 hover:bg-gray-200 font-bold text-xs">Search</button>
                </div>
             </div>
          </div>
          <div className="space-y-6">
             <div className="text-sm text-gray-600 italic">Results for: <span className="font-bold text-black">{searchQuery || 'Web'}</span></div>
             <div className="space-y-4">
                {publishedContent.map(p => (
                   <div key={p.id} className="max-w-2xl">
                      <a href="#" onClick={() => setUrl(p.url)} className="text-blue-800 text-lg hover:underline font-medium">{p.title}</a>
                      <div className="text-green-700 text-xs">{p.url}</div>
                      <p className="text-sm text-gray-700 truncate">Página criada pelo usuário GitWeb Publisher.</p>
                   </div>
                ))}
                <div className="max-w-2xl">
                   <a href="#" onClick={() => setUrl('http://clubpenguin.com')} className="text-blue-800 text-lg hover:underline font-medium">Club Penguin - Waddle Around and Meet Friends!</a>
                   <div className="text-green-700 text-xs">www.clubpenguin.com</div>
                   <p className="text-sm text-gray-700">A massive multiplayer online game for kids. Play games, earn coins, and chat with your penguin friends.</p>
                </div>
             </div>
          </div>
        </div>
      );
    }
    
    if (url.includes('yahoo.com')) {
      return (
        <div className="bg-white p-4 font-[Arial]">
          <div className="text-[#400090] text-4xl font-bold mb-4 border-b-2 border-[#400090] pb-2">YAHOO!</div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="col-span-2 space-y-4">
               <div className="bg-[#f2f2f2] p-2 border border-gray-300 font-bold">Search the Web: <input className="border px-2 ml-2" /> <button className="bg-[#400090] text-white px-2">Search</button></div>
               <div className="font-bold text-red-600">Breaking News: New records set in retro computing.</div>
               <div className="space-y-2">
                 <h3 className="font-bold border-b">In the News</h3>
                 <ul className="list-disc pl-4 text-blue-700 underline">
                   <li>Tsunami relief efforts continue in Asia</li>
                   <li>Million Dollar Baby wins big at Oscars</li>
                 </ul>
               </div>
            </div>
          </div>
        </div>
      );
    }

    if (match) {
        return (
          <div className="w-full h-full bg-white">
            <iframe 
               title={match.title}
               srcDoc={match.content}
               className="w-full h-full border-none"
            />
          </div>
        );
    }

    return null;
  };

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] font-[Tahoma] overflow-hidden select-none">
      {/* Toolbar XP */}
      <div className="flex items-center gap-1 p-1 border-b border-gray-400 bg-[#ece9d8] shadow-sm overflow-x-auto no-scrollbar">
        <button onClick={() => { setUrl('http://portal.xp/home'); setIsSearching(false); }} className="p-1 hover:bg-gray-200 rounded flex-shrink-0">
          <img src="https://win98icons.alexmeub.com/icons/png/house-0.png" className="w-5 h-5" alt="Home" />
        </button>
        
        {/* Address Bar */}
        <form onSubmit={handleGo} className="flex-[2] min-w-[150px] flex items-center bg-white border border-gray-500 h-6 px-1">
           <span className="text-gray-500 text-[10px] mr-1 hidden sm:inline">Address</span>
           <input type="text" value={url} onChange={e => setUrl(e.target.value)} className="flex-1 outline-none text-[12px] bg-transparent" />
        </form>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 min-w-[100px] flex items-center bg-white border border-gray-500 h-6 px-1 ml-1">
           <span className="text-gray-500 text-[10px] mr-1 hidden sm:inline">Search</span>
           <input 
              type="text" 
              placeholder="Search web..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              className="flex-1 outline-none text-[12px] bg-transparent" 
           />
           <button type="submit">
              <img src="https://win98icons.alexmeub.com/icons/png/search_file-2.png" className="w-4 h-4" alt="" />
           </button>
        </form>

        <button onClick={() => handleGo()} className="px-2 py-0.5 bg-gray-100 border border-gray-500 text-[10px] font-bold ml-1 flex-shrink-0">Go</button>
      </div>

      <div className="flex-1 bg-white overflow-auto xp-scrollbar">
        {url === 'http://portal.xp/home' ? (
          <div className="p-8 max-w-4xl mx-auto font-[Arial]">
            <h1 className="text-4xl font-black text-blue-900 mb-8 border-b-4 border-blue-600 pb-2">XP WEB PORTAL 2004</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <section className="space-y-4">
                  <h2 className="font-bold text-lg text-gray-700">Top Destinations</h2>
                  <div className="grid gap-2">
                    {publishedContent.length > 0 && <div className="text-xs font-bold text-blue-600 italic">Páginas de Usuário Recentes:</div>}
                    {publishedContent.slice(0, 3).map(p => (
                       <button key={p.id} onClick={() => setUrl(p.url)} className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 hover:border-blue-500 text-left">
                          <img src="https://win98icons.alexmeub.com/icons/png/world-0.png" className="w-4 h-4" alt="" />
                          <div className="font-bold text-blue-800 text-xs">{p.title}</div>
                       </button>
                    ))}
                    <button onClick={() => setUrl('http://yahoo.com')} className="flex items-center gap-2 p-3 bg-[#f8f8f8] border hover:border-blue-500 text-left">
                       <img src="https://win98icons.alexmeub.com/icons/png/world-0.png" className="w-6 h-6" alt="" />
                       <div><div className="font-bold text-blue-700">Yahoo!</div><div className="text-[10px]">News, Mail & Search</div></div>
                    </button>
                  </div>
               </section>
            </div>
          </div>
        ) : renderClassicSite() || (
          <div className="flex flex-col items-center justify-center h-full p-10 text-center">
             <img src="https://win98icons.alexmeub.com/icons/png/world-0.png" className="w-20 h-20 opacity-20 mb-4" alt="" />
             <h2 className="text-2xl font-bold text-gray-400">404 - Not Found</h2>
             <button onClick={() => { setUrl('http://portal.xp/home'); setIsSearching(false); }} className="mt-4 text-blue-600 underline">Back to Home</button>
          </div>
        )}
      </div>
    </div>
  );
};
