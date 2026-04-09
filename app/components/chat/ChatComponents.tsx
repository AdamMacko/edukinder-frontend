"use client";

import React, { useMemo, useState } from "react";
import {
    Search,
    Send,
    Paperclip,
    Smile,
    ArrowLeft,
    Info,
    Plus,
    X,
} from "lucide-react";

type SidebarConversation = {
    id: number;
    name: string;
    avatar: string;
    time: string;
    lastMessage: string;
    unread: number;
    online?: boolean;
};

type ChatMessage = {
    id: number;
    text: string;
    time: string;
    isMe: boolean;
    isAttachment?: boolean;
    attachmentName?: string | null;
    attachmentUrl?: string;
};

type ActiveChat = {
    id: number;
    name: string;
    avatar: string;
    role?: string;
    messages: ChatMessage[];
};

type UserPick = {
    id: number;
    name: string;
    email: string;
};

export function ChatSidebar({
                                conversations,
                                activeId,
                                onSelect,
                                onNewMessage,
                                isMobileHidden,
                            }: {
    conversations: SidebarConversation[];
    activeId: number | null;
    onSelect: (id: number) => void;
    onNewMessage: () => void;
    isMobileHidden: boolean;
}) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        return conversations.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [conversations, search]);

    return (
        <div
            className={`flex flex-col h-full bg-white/40 backdrop-blur-md border-r border-white/50 w-full md:w-80 lg:w-96 flex-shrink-0 transition-all ${
                isMobileHidden ? "hidden md:flex" : "flex"
            }`}
        >
            <div className="p-4 border-b border-white/40">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-black text-[#3E2E48]">Správy</h2>
                    <button
                        type="button"
                        onClick={onNewMessage}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#3E2E48] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                    >
                        <Plus className="h-4 w-4" />
                        Nová
                    </button>
                </div>

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

export function ChatArea({
                             activeChat,
                             onBack,
                             isMobileHidden,
                             draft,
                             onDraftChange,
                             onSend,
                             fileName,
                             onPickFile,
                         }: {
    activeChat: ActiveChat | null;
    onBack: () => void;
    isMobileHidden: boolean;
    draft: string;
    onDraftChange: (value: string) => void;
    onSend: () => void;
    fileName?: string | null;
    onPickFile: () => void;
}) {
    if (!activeChat) {
        return (
            <div
                className={`flex flex-col h-full flex-1 items-center justify-center bg-white/20 backdrop-blur-sm ${
                    isMobileHidden ? "hidden md:flex" : "hidden md:flex"
                }`}
            >
                <div className="text-center">
                    <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-white/60">
                        <Smile className="w-10 h-10 text-[#d0a91a]/50" />
                    </div>
                    <h3 className="text-xl font-bold text-[#3E2E48]/60">
                        Vyberte konverzáciu
                    </h3>
                    <p className="text-sm font-medium text-[#3E2E48]/40 mt-1">
                        Prečítajte si správy od rodičov alebo kolegov.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`flex flex-col h-full flex-1 bg-white/30 backdrop-blur-sm ${
                isMobileHidden ? "hidden md:flex" : "flex"
            }`}
        >
            <div className="flex items-center justify-between p-4 border-b border-white/40 bg-white/40">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="md:hidden p-2 -ml-2 rounded-full hover:bg-white/60 text-[#3E2E48]"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fcf7f3] to-[#e8dfd8] flex items-center justify-center text-[#3E2E48] font-bold border border-[#3E2E48]/10">
                        {activeChat.avatar}
                    </div>

                    <div>
                        <h3 className="font-bold text-[#3E2E48] leading-tight">
                            {activeChat.name}
                        </h3>
                        <p className="text-xs font-semibold text-[#d0a91a]">
                            {activeChat.role ?? "Používateľ"}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="p-2 rounded-full hover:bg-white/60 text-[#3E2E48]/60 transition-colors">
                        <Info className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
                {activeChat.messages?.length > 0 ? (
                    activeChat.messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] md:max-w-[60%] flex flex-col ${
                                    msg.isMe ? "items-end" : "items-start"
                                }`}
                            >
                                <div
                                    className={`p-3.5 rounded-2xl text-sm font-medium shadow-sm ${
                                        msg.isMe
                                            ? "bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] text-white rounded-br-sm"
                                            : "bg-white text-[#3E2E48] rounded-bl-sm border border-[#3E2E48]/5"
                                    }`}
                                >
                                    {!msg.isAttachment ? (
                                        msg.text
                                    ) : (
                                        <div className="space-y-2">
                                            <div>
                                                Príloha: <b>{msg.attachmentName ?? "Súbor"}</b>
                                            </div>
                                            <a
                                                href={msg.attachmentUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={`underline ${
                                                    msg.isMe ? "text-white" : "text-[#3E2E48]"
                                                }`}
                                            >
                                                Stiahnuť
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <span className="text-[10px] font-bold text-[#3E2E48]/40 mt-1 px-1">
                  {msg.time}
                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-sm font-medium text-[#3E2E48]/40">
                            Začnite konverzáciu...
                        </p>
                    </div>
                )}
            </div>

            <div className="p-4 bg-white/50 border-t border-white/40">
                {fileName && (
                    <div className="mb-3 rounded-xl bg-white/70 px-4 py-2 text-sm font-medium text-[#3E2E48]/70 border border-[#3E2E48]/10">
                        Vybraný súbor: {fileName}
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onPickFile}
                        className="p-2.5 rounded-full hover:bg-white text-[#3E2E48]/50 transition-colors"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Napíšte správu..."
                            value={draft}
                            onChange={(e) => onDraftChange(e.target.value)}
                            className="w-full bg-white border border-[#3E2E48]/10 rounded-full py-3 pl-5 pr-10 text-sm font-medium outline-none focus:border-[#d0a91a] transition-all shadow-sm"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") onSend();
                            }}
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3E2E48]/40 hover:text-[#d0a91a]">
                            <Smile className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={onSend}
                        className="flex items-center justify-center w-11 h-11 rounded-full bg-[#3E2E48] text-white hover:opacity-90 transition-opacity shadow-md"
                    >
                        <Send className="w-5 h-5 -ml-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export function NewMessageModal({
                                    open,
                                    onClose,
                                    query,
                                    onQueryChange,
                                    selectedUsers,
                                    onRemoveUser,
                                    results,
                                    loading,
                                    onPickUser,
                                    bulkText,
                                    onBulkTextChange,
                                    onSendBulk,
                                }: {
    open: boolean;
    onClose: () => void;
    query: string;
    onQueryChange: (value: string) => void;
    selectedUsers: UserPick[];
    onRemoveUser: (id: number) => void;
    results: UserPick[];
    loading: boolean;
    onPickUser: (u: UserPick) => void;
    bulkText: string;
    onBulkTextChange: (value: string) => void;
    onSendBulk: () => void;
}) {
    const showDropdown = query.trim().length >= 2 && (loading || results.length > 0);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-[#2a2130]/35 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl rounded-[32px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(62,46,72,0.18)] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-[#3E2E48]/8 px-6 py-5">
                    <div>
                        <div className="mb-2 inline-flex rounded-full bg-[#fff7dc] px-3 py-1 text-xs font-bold tracking-wide text-[#9b7a00]">
                            Nová správa
                        </div>
                        <h2 className="text-2xl font-black text-[#3E2E48]">
                            Hromadná správa
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#3E2E48]/10 bg-[#faf7f4] text-xl font-semibold text-[#3E2E48]/70 transition hover:bg-[#f3ede8]"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="px-6 py-6">
                    <label className="mb-2 block text-sm font-bold text-[#3E2E48]">
                        Komu:
                    </label>

                    <input
                        className="w-full rounded-2xl border border-[#3E2E48]/12 bg-[#fcfaf8] px-4 py-3 text-[#3E2E48] outline-none transition placeholder:text-[#3E2E48]/35 focus:border-[#d0a91a]"
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder="Začni písať meno alebo e-mail…"
                    />

                    {selectedUsers.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {selectedUsers.map((u) => (
                                <button
                                    key={u.id}
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#f8f5f2] px-3 py-2 text-sm font-semibold text-[#3E2E48]"
                                    onClick={() => onRemoveUser(u.id)}
                                >
                                    {u.name}
                                    <span className="text-[#3E2E48]/50">×</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {showDropdown && (
                        <div className="mt-3 rounded-2xl border border-[#3E2E48]/8 bg-white overflow-hidden">
                            {loading && (
                                <div className="px-4 py-3 text-sm text-[#3E2E48]/60">
                                    Načítavam…
                                </div>
                            )}

                            {!loading &&
                                results.map((u) => (
                                    <button
                                        key={u.id}
                                        type="button"
                                        className="block w-full border-b last:border-b-0 border-[#3E2E48]/8 px-4 py-3 text-left hover:bg-[#faf7f4]"
                                        onClick={() => onPickUser(u)}
                                    >
                                        <div className="font-semibold text-[#3E2E48]">{u.name}</div>
                                        <div className="text-sm text-[#3E2E48]/55">{u.email}</div>
                                    </button>
                                ))}

                            {!loading && results.length === 0 && (
                                <div className="px-4 py-3 text-sm text-[#3E2E48]/60">
                                    Nič sa nenašlo.
                                </div>
                            )}
                        </div>
                    )}

                    <label className="mt-5 mb-2 block text-sm font-bold text-[#3E2E48]">
                        Správa:
                    </label>

                    <textarea
                        value={bulkText}
                        onChange={(e) => onBulkTextChange(e.target.value)}
                        rows={4}
                        placeholder="Napíš správu, ktorá sa pošle všetkým vybraným…"
                        className="w-full rounded-2xl border border-[#3E2E48]/12 bg-[#fcfaf8] px-4 py-3 text-[#3E2E48] outline-none transition placeholder:text-[#3E2E48]/35 focus:border-[#d0a91a]"
                    />

                    <div className="mt-5 flex justify-end">
                        <button
                            type="button"
                            disabled={selectedUsers.length === 0 || !bulkText.trim()}
                            onClick={onSendBulk}
                            className="rounded-2xl bg-[#d0a91a] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#d0a91a]/20 transition hover:translate-y-[-1px] hover:shadow-xl disabled:opacity-60 disabled:translate-y-0"
                        >
                            Odoslať všetkým
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}