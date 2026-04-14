"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Send,
    Paperclip,
    Smile,
    ArrowLeft,
    Info,
    Trash2,
} from "lucide-react";
import type { Conversation, ThreadMsg } from "@/lib/api/chat";
import { fmtDateTime, fmtShortTime } from "@/lib/api/chat";

type ChatAreaProps = {
    activeConversation: Conversation | null;
    messages: ThreadMsg[];
    myId: number | null;
    onBack: () => void;
    isMobileHidden: boolean;
    onSend: (params: { text: string; file: File | null }) => Promise<void>;
    onDeleteConversation: (partnerId: number) => Promise<void>;
};

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);
    return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

function toDownloadUrl(pathOrUrl: string) {
    const API_BASE = process.env.API_BASE ?? "http://localhost:5000";
    const p = pathOrUrl.trim();
    if (!p) return "#";
    if (p.startsWith("http://") || p.startsWith("https://")) return p;
    if (p.startsWith("/")) return `${API_BASE}${p}`;
    return `${API_BASE}/${p}`;
}

export function ChatArea({
                             activeConversation,
                             messages,
                             myId,
                             onBack,
                             isMobileHidden,
                             onSend,
                             onDeleteConversation,
                         }: ChatAreaProps) {
    const [inputText, setInputText] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const threadRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const el = threadRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [messages]);

    const activeChat = useMemo(() => {
        if (!activeConversation) return null;
        return {
            id: activeConversation.partnerId,
            name: activeConversation.partnerName,
            avatar: getInitials(activeConversation.partnerName),
            role: "",
        };
    }, [activeConversation]);

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

    async function handleSend() {
        const text = inputText.trim();
        if (!text && !file) return;

        await onSend({ text, file });

        setInputText("");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
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
                            {activeConversation?.lastAt ? fmtShortTime(activeConversation.lastAt) : ""}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="p-2 rounded-full hover:bg-white/60 text-[#3E2E48]/60 transition-colors">
                        <Info className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => {
                            if (!activeConversation) return;
                            onDeleteConversation(activeConversation.partnerId);
                        }}
                        className="p-2 rounded-full hover:bg-white/60 text-[#b15252] transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div
                ref={threadRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar"
            >
                {messages.length > 0 ? (
                    messages.map((msg) => {
                        const isMe = myId != null && msg.senderId === myId;

                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] md:max-w-[60%] flex flex-col ${
                                        isMe ? "items-end" : "items-start"
                                    }`}
                                >
                                    <div
                                        className={`p-3.5 rounded-2xl text-sm font-medium shadow-sm ${
                                            isMe
                                                ? "bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] text-white rounded-br-sm"
                                                : "bg-white text-[#3E2E48] rounded-bl-sm border border-[#3E2E48]/5"
                                        }`}
                                    >
                                        {!msg.isAttachment ? (
                                            msg.value
                                        ) : (
                                            <div className="space-y-2">
                                                <div>
                                                    Príloha: <b>{msg.attachmentName ?? "Súbor"}</b>
                                                </div>
                                                <a
                                                    className={`underline ${isMe ? "text-white" : "text-[#3E2E48]"}`}
                                                    href={toDownloadUrl(msg.value)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Stiahnuť
                                                </a>
                                                {typeof msg.attachmentSize === "number" && (
                                                    <div className={`text-xs ${isMe ? "text-white/80" : "text-[#3E2E48]/60"}`}>
                                                        {Math.round(msg.attachmentSize / 1024)} KB
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold text-[#3E2E48]/40 mt-1 px-1">
                    {fmtDateTime(msg.createdAt)}
                  </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-sm font-medium text-[#3E2E48]/40">
                            Začnite konverzáciu...
                        </p>
                    </div>
                )}
            </div>

            <div className="p-4 bg-white/50 border-t border-white/40">
                {file && (
                    <div className="mb-2 rounded-xl bg-white px-3 py-2 text-sm text-[#3E2E48]/70 border border-[#3E2E48]/10">
                        Vybraný súbor: <b>{file.name}</b>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <label className="p-2.5 rounded-full hover:bg-white text-[#3E2E48]/50 transition-colors cursor-pointer">
                        <Paperclip className="w-5 h-5" />
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                    </label>

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Napíšte správu..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="w-full bg-white border border-[#3E2E48]/10 rounded-full py-3 pl-5 pr-10 text-sm font-medium outline-none focus:border-[#d0a91a] transition-all shadow-sm"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3E2E48]/40 hover:text-[#d0a91a]">
                            <Smile className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim() && !file}
                        className="flex items-center justify-center w-11 h-11 rounded-full bg-[#3E2E48] text-white hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
                    >
                        <Send className="w-5 h-5 -ml-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}