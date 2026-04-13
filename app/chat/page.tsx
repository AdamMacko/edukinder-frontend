"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Header } from "@/app/components/header/Header";
import { ChatSidebar } from "@/app/components/chat/ChatSidebar";
import { ChatArea } from "@/app/components/chat/ChatArea";
import { NewMessageModal } from "@/app/components/chat/NewMessageModal";
import { Plus } from "lucide-react"; // Odporúčam pridať ikonku
import {
    deleteConversation,
    fetchConversations,
    fetchMe,
    fetchThread,
    getErrorMessage,
    markRead,
    searchUsers,
    sendBulkMessage,
    sendMessage,
    type Conversation,
    type Me,
    type ThreadMsg,
    type UserPick,
} from "@/lib/api/chat";

export default function ChatPage() {
    const [me, setMe] = useState<Me>(null);
    const [convos, setConvos] = useState<Conversation[]>([]);
    const [activeChatId, setActiveChatId] = useState<number | null>(null);
    const [thread, setThread] = useState<ThreadMsg[]>([]);
    const [err, setErr] = useState<string | null>(null);

    const [newOpen, setNewOpen] = useState(false);
    const [userQ, setUserQ] = useState("");
    const [userHits, setUserHits] = useState<UserPick[]>([]);
    const [userLoading, setUserLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<UserPick[]>([]);
    const [bulkText, setBulkText] = useState("");

    const activeConversation = useMemo(
        () => convos.find((c) => c.partnerId === activeChatId) ?? null,
        [convos, activeChatId]
    );

    async function loadConversations() {
        const data = await fetchConversations();
        setConvos(data);
        return data;
    }

    async function openThread(partnerId: number) {
        setActiveChatId(partnerId);

        const msgs = await fetchThread(partnerId);
        setThread(msgs);

        markRead(partnerId).catch(() => {});
        loadConversations().catch(() => {});
    }

    async function handleDeleteConversation(partnerId: number) {
        if (!window.confirm("Naozaj chceš vymazať túto konverzáciu?")) return;

        await deleteConversation(partnerId);
        await loadConversations();

        setThread((prev) => (activeChatId === partnerId ? [] : prev));
        setActiveChatId((prev) => (prev === partnerId ? null : prev));
    }

    function addSelected(u: UserPick) {
        setSelectedUsers((prev) =>
            prev.some((x) => x.id === u.id) ? prev : [...prev, u]
        );
    }

    function removeSelected(id: number) {
        setSelectedUsers((prev) => prev.filter((x) => x.id !== id));
    }

    async function handleSendBulk() {
        const text = bulkText.trim();
        if (!text || selectedUsers.length === 0) return;

        await sendBulkMessage(
            selectedUsers.map((u) => u.id),
            text
        );

        setNewOpen(false);
        setSelectedUsers([]);
        setBulkText("");
        setUserQ("");
        setUserHits([]);

        await loadConversations();
    }

    async function handleSend(params: { text: string; file: File | null }) {
        const partnerId = activeChatId;
        const myId = me?.id ?? null;
        if (!partnerId || !myId) return;

        const text = params.text.trim();
        const hasFile = params.file != null;
        if (!hasFile && !text) return;

        const optimistic: ThreadMsg = {
            id: -Date.now(),
            senderId: myId,
            recipientId: partnerId,
            value: hasFile ? params.file?.name ?? "Príloha" : text,
            createdAt: new Date().toISOString(),
            readAt: null,
            isAttachment: hasFile,
            attachmentName: hasFile ? params.file?.name ?? null : null,
            attachmentMime: hasFile ? params.file?.type || null : null,
            attachmentSize: hasFile ? params.file?.size ?? null : null,
        };

        setThread((prev) => [...prev, optimistic]);

        try {
            await sendMessage({
                recipientId: partnerId,
                value: text,
                file: params.file,
            });

            await openThread(partnerId);
            await loadConversations();
        } catch (errx) {
            setErr(getErrorMessage(errx));
            setThread((prev) => prev.filter((m) => m.id !== optimistic.id));
            throw errx;
        }
    }

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setErr(null);

                const meData = await fetchMe();
                if (!alive) return;
                setMe(meData);

                const c = await fetchConversations();
                if (!alive) return;
                setConvos(c);
            } catch (e) {
                if (alive) setErr(getErrorMessage(e));
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    useEffect(() => {
        if (activeChatId == null && convos.length > 0) {
            openThread(convos[0].partnerId).catch((e) => setErr(getErrorMessage(e)));
        }
    }, [convos]);

    useEffect(() => {
        if (!newOpen) return;

        const q = userQ.trim();
        if (q.length < 2) {
            setUserHits([]);
            setUserLoading(false);
            return;
        }

        const t = window.setTimeout(async () => {
            try {
                setUserLoading(true);
                const hits = await searchUsers(q, me?.id);
                setUserHits(hits);
            } catch (e) {
                setErr(getErrorMessage(e));
            } finally {
                setUserLoading(false);
            }
        }, 250);

        return () => window.clearTimeout(t);
    }, [newOpen, userQ, me?.id]);

    function closeModal() {
        setNewOpen(false);
        setUserQ("");
        setUserHits([]);
        setUserLoading(false);
        setSelectedUsers([]);
        setBulkText("");
    }

    return (
        // Hlavný obal je prísne 100dvh a bráni scrollovaniu celej stránky
        <div className="h-[100dvh] bg-[#fcf7f3] flex flex-col overflow-hidden">
            <Header />

            {/* Zjednotený responzívny kontajner. flex-1 mu povie: zaber zvyšok obrazovky */}
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 min-h-0 flex flex-col">
                
                {/* Chybová hláška (s jemnou animáciou) */}
                {err && (
                    <div className="mb-4 animate-in fade-in slide-in-from-top-2 rounded-2xl border border-[#f0caca] bg-[#fbe7e7] px-4 py-3 text-sm font-medium text-[#a94f4f] shadow-sm">
                        {err}
                    </div>
                )}

                {/* Samotné chatovacie okno - zaberie celý zvyšný priestor kontajnera */}
                <div className="flex-1 w-full flex rounded-[32px] overflow-hidden border border-white/70 bg-white/70 shadow-[0_20px_60px_rgba(62,46,72,0.08)] backdrop-blur-xl">
                    
                    <ChatSidebar
                        conversations={convos}
                        activeId={activeChatId}
                        onSelect={(id) => {
                            openThread(id).catch((e) => setErr(getErrorMessage(e)));
                        }}
                        isMobileHidden={activeChatId !== null}
                    />

                    <ChatArea
                        activeConversation={activeConversation}
                        messages={thread}
                        myId={me?.id ?? null}
                        onBack={() => setActiveChatId(null)}
                        isMobileHidden={activeChatId === null}
                        onSend={handleSend}
                        onDeleteConversation={handleDeleteConversation}
                    />
                </div>
            </div>

            {/* Vylepšené FAB tlačidlo (Floating Action Button) s responzívnym umiestnením */}
            <button
                type="button"
                onClick={() => setNewOpen(true)}
                className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 lg:bottom-12 lg:right-12 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d0a91a] to-[#e2c26a] text-white px-5 py-3.5 font-bold shadow-lg shadow-[#d0a91a]/30 transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
                <Plus className="w-5 h-5" strokeWidth={3} />
                <span className="hidden sm:inline">Nová správa</span>
            </button>

            <NewMessageModal
                open={newOpen}
                userQuery={userQ}
                onUserQueryChange={setUserQ}
                userHits={userHits}
                userLoading={userLoading}
                selectedUsers={selectedUsers}
                onAddUser={addSelected}
                onRemoveUser={removeSelected}
                bulkText={bulkText}
                onBulkTextChange={setBulkText}
                onClose={closeModal}
                onSendBulk={handleSendBulk}
            />
        </div>
    );
}