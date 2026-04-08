"use client";

import React, { useState } from "react";
import { Header } from "@/app/components/Header";
import { ChatSidebar, ChatArea } from "../components/chat/ChatComponents";
import { MOCK_CONVERSATIONS } from "./mockData";

export default function ChatPage() {
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  const activeChat = MOCK_CONVERSATIONS.find(c => c.id === activeChatId);

  return (
    /* h-[100dvh] zaručí, že stránka zaberie presne výšku obrazovky a ani o pixel viac. */
    <div className="h-[100dvh] bg-[#fcf7f3] flex flex-col overflow-hidden">
      
      {/* Hlavička hore */}
      <Header />

      {/* Kontajner, ktorý si vezme zvyšný priestor (flex-1). min-h-0 je tu kľúčové, 
          zabraňuje flexboxu, aby expandoval mimo obrazovku, keď je veľa obsahu. */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-6 min-h-0">
        
        {/* Luxusný Box pre samotný chat. Tiež h-full, aby zaplnil celý priestor do prasknutia */}
        <div className="w-full h-full flex rounded-[32px] overflow-hidden border border-white/70 bg-white/30 shadow-[0_20px_60px_rgba(62,46,72,0.08)] backdrop-blur-xl">
          
          <ChatSidebar 
            conversations={MOCK_CONVERSATIONS} 
            activeId={activeChatId} 
            onSelect={setActiveChatId}
            isMobileHidden={activeChatId !== null} 
          />

          <ChatArea 
            activeChat={activeChat} 
            onBack={() => setActiveChatId(null)}
            isMobileHidden={activeChatId === null}
          />
          
        </div>
      </div>
    </div>
  );
}