"use client";

import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Conversation } from "@/lib/api/chat";
import { fmtShortTime } from "@/lib/api/chat";

type SidebarConversation = Conversation & {
    id: number;
    name: string;
    time: string;
    unread: number;
    avatar: string;
    online: boolean;
};

type ChatSidebarProps = {
    conversations: Conversation[];
    activeId: number | null;
    onSelect: (id: number) => void;
    isMobileHidden: boolean;
};

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);
    return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

export function ChatSidebar({
                                conversations,
                                activeId,
                                onSelect,
                                isMobileHidden,
                            }: ChatSidebarProps) {
    const [search, setSearch] = useState("");

    const filtered = useMemo<SidebarConversation[]>(() => {
        return conversations
            .filter((c) =>
                c.partnerName.toLowerCase().includes(search.toLowerCase())
            )
            .map((c) => ({
                ...c,
                id: c.partnerId,
                name: c.partnerName,
                time: c.lastAt ? fmtShortTime(c.lastAt) : "",
                unread: c.unreadCount,
                avatar: getInitials(c.partnerName),
                online: false,
            }));
    }, [conversations, search]);

    return (
        <div
            className={`flex flex-col h-full bg-white/40 backdrop-blur-md border-r border-white/50 w-full md:w-80 lg:w-96 flex-shrink-0 transition-all ${
                isMobileHidden ? "hidden md:flex" : "flex"
            }`}
        >
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
                {filtered.map((chat) => (
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
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h4 className="font-bold text-[#3E2E48] truncate pr-2">
                                    {chat.name}
                                </h4>
                                <span className="text-xs font-semibold text-[#3E2E48]/40">
                  {chat.time}
                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p
                                    className={`text-xs truncate pr-2 ${
                                        chat.unread > 0
                                            ? "font-bold text-[#3E2E48]"
                                            : "font-medium text-[#3E2E48]/60"
                                    }`}
                                >
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