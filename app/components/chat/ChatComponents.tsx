import React, { useState } from "react";
import { Search, Send, Paperclip, Smile, ArrowLeft, Info } from "lucide-react"; // Odstránený Phone import

// --- BOČNÝ PANEL (ZOZNAM KONVERZÁCIÍ) ---
export function ChatSidebar({ conversations, activeId, onSelect, isMobileHidden }: any) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c: any) => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`flex flex-col h-full bg-white/40 backdrop-blur-md border-r border-white/50 w-full md:w-80 lg:w-96 flex-shrink-0 transition-all ${isMobileHidden ? 'hidden md:flex' : 'flex'}`}>
      <div className="p-4 border-b border-white/40">
        <h2 className="text-2xl font-black text-[#3E2E48] mb-4">Správy</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3E2E48]/40" />
          <input
            type="text"
            placeholder="Hľadať konverzáciu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/60 border border-[#3E2E48]/10 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#d0a91a] focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {filtered.map((chat: any) => (
          <button
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${
              activeId === chat.id 
                ? "bg-white shadow-sm border border-[#3E2E48]/5" 
                : "hover:bg-white/50 border border-transparent"
            }`}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#fcf7f3] to-[#e8dfd8] flex items-center justify-center text-[#3E2E48] font-black border border-[#3E2E48]/10">
                {chat.avatar}
              </div>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h4 className="font-bold text-[#3E2E48] truncate pr-2">{chat.name}</h4>
                <span className="text-xs font-semibold text-[#3E2E48]/40">{chat.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-xs truncate pr-2 ${chat.unread > 0 ? "font-bold text-[#3E2E48]" : "font-medium text-[#3E2E48]/60"}`}>
                  {chat.lastMessage}
                </p>
                {chat.unread > 0 && (
                  <span className="bg-[#d0a91a] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// --- HLAVNÉ OKNO CHATU ---
export function ChatArea({ activeChat, onBack, isMobileHidden }: any) {
  const [inputText, setInputText] = useState("");

  if (!activeChat) {
    return (
      <div className={`flex flex-col h-full flex-1 items-center justify-center bg-white/20 backdrop-blur-sm ${isMobileHidden ? 'hidden md:flex' : 'hidden md:flex'}`}>
        <div className="text-center">
          <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-white/60">
            <Smile className="w-10 h-10 text-[#d0a91a]/50" />
          </div>
          <h3 className="text-xl font-bold text-[#3E2E48]/60">Vyberte konverzáciu</h3>
          <p className="text-sm font-medium text-[#3E2E48]/40 mt-1">Prečítajte si správy od rodičov alebo kolegov.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full flex-1 bg-white/30 backdrop-blur-sm ${isMobileHidden ? 'hidden md:flex' : 'flex'}`}>
      
      <div className="flex items-center justify-between p-4 border-b border-white/40 bg-white/40">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="md:hidden p-2 -ml-2 rounded-full hover:bg-white/60 text-[#3E2E48]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fcf7f3] to-[#e8dfd8] flex items-center justify-center text-[#3E2E48] font-bold border border-[#3E2E48]/10">
            {activeChat.avatar}
          </div>
          <div>
            <h3 className="font-bold text-[#3E2E48] leading-tight">{activeChat.name}</h3>
            <p className="text-xs font-semibold text-[#d0a91a]">{activeChat.role}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {/* Odstránené tlačidlo pre volanie */}
          <button className="p-2 rounded-full hover:bg-white/60 text-[#3E2E48]/60 transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Priestor pre správy - flex-1 zabezpečí, že input bude vždy dole */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
        {activeChat.messages?.length > 0 ? (
          activeChat.messages.map((msg: any) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] md:max-w-[60%] flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`p-3.5 rounded-2xl text-sm font-medium shadow-sm ${
                    msg.isMe 
                      ? "bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] text-white rounded-br-sm" 
                      : "bg-white text-[#3E2E48] rounded-bl-sm border border-[#3E2E48]/5"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] font-bold text-[#3E2E48]/40 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            </div>
          ))
        ) : (
           /* Ak je chat prázdny, zobrazí sa len toto a input zostane dole */
          <div className="h-full flex items-center justify-center">
            <p className="text-sm font-medium text-[#3E2E48]/40">Začnite konverzáciu...</p>
          </div>
        )}
      </div>

      {/* Input pre písanie - Prilepený dole */}
      <div className="p-4 bg-white/50 border-t border-white/40">
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-full hover:bg-white text-[#3E2E48]/50 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Napíšte správu..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-white border border-[#3E2E48]/10 rounded-full py-3 pl-5 pr-10 text-sm font-medium outline-none focus:border-[#d0a91a] transition-all shadow-sm"
              onKeyDown={(e) => e.key === 'Enter' && setInputText("")}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3E2E48]/40 hover:text-[#d0a91a]">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={() => setInputText("")}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-[#3E2E48] text-white hover:opacity-90 transition-opacity shadow-md"
          >
            <Send className="w-5 h-5 -ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}