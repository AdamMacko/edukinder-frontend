"use client";

import { useMemo, useState } from "react";
import type { UserPick } from "@/lib/api/chat";

type NewMessageModalProps = {
    open: boolean;
    userQuery: string;
    onUserQueryChange: (v: string) => void;
    userHits: UserPick[];
    userLoading: boolean;
    selectedUsers: UserPick[];
    onAddUser: (u: UserPick) => void;
    onRemoveUser: (id: number) => void;
    bulkText: string;
    onBulkTextChange: (v: string) => void;
    onClose: () => void;
    onSendBulk: () => Promise<void>;
};

export function NewMessageModal({
                                    open,
                                    userQuery,
                                    onUserQueryChange,
                                    userHits,
                                    userLoading,
                                    selectedUsers,
                                    onAddUser,
                                    onRemoveUser,
                                    bulkText,
                                    onBulkTextChange,
                                    onClose,
                                    onSendBulk,
                                }: NewMessageModalProps) {
    const [userOpen, setUserOpen] = useState(false);

    const showDropdown = useMemo(() => {
        const qTrim = userQuery.trim();
        return userOpen && qTrim.length >= 2 && (userLoading || userHits.length > 0);
    }, [userOpen, userQuery, userLoading, userHits.length]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-[#2a2130]/35 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl rounded-[32px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(62,46,72,0.18)] p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-black text-[#3E2E48]">Nová správa</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl border border-[#3E2E48]/10 bg-white px-4 py-2 text-sm font-semibold text-[#3E2E48] hover:bg-[#faf7f4]"
                    >
                        Zavrieť
                    </button>
                </div>

                <label className="mb-2 block text-sm font-bold text-[#3E2E48]">
                    Komu:
                </label>

                <input
                    value={userQuery}
                    onChange={(e) => onUserQueryChange(e.target.value)}
                    onFocus={() => setUserOpen(true)}
                    onBlur={() => {
                        window.setTimeout(() => setUserOpen(false), 120);
                    }}
                    placeholder="Začni písať meno alebo e-mail..."
                    autoComplete="off"
                    className="w-full bg-[#fcfaf8] border border-[#3E2E48]/10 rounded-2xl py-3 px-4 text-sm font-medium text-[#3E2E48] placeholder:text-[#3E2E48]/35 outline-none focus:border-[#d0a91a] transition-all"
                />

                {selectedUsers.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {selectedUsers.map((u) => (
                            <button
                                key={u.id}
                                type="button"
                                onClick={() => onRemoveUser(u.id)}
                                className="rounded-full bg-[#3E2E48] text-white text-sm px-3 py-1.5 font-medium"
                            >
                                {u.name} <span className="ml-1">×</span>
                            </button>
                        ))}
                    </div>
                )}

                {showDropdown && (
                    <div className="mt-2 rounded-2xl border border-[#3E2E48]/10 bg-white shadow-lg overflow-hidden">
                        {userLoading && (
                            <div className="px-4 py-3 text-sm text-[#3E2E48]/60">Načítavam…</div>
                        )}

                        {!userLoading &&
                            userHits.map((u) => (
                                <button
                                    key={u.id}
                                    type="button"
                                    className="w-full text-left px-4 py-3 hover:bg-[#f8f5f2] border-b border-[#3E2E48]/5 last:border-b-0"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onAddUser(u);
                                        onUserQueryChange("");
                                    }}
                                >
                                    <div className="font-semibold text-[#3E2E48]">{u.name}</div>
                                    <div className="text-sm text-[#3E2E48]/55">{u.email}</div>
                                </button>
                            ))}

                        {!userLoading && userHits.length === 0 && (
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
                    placeholder="Napíš správu, ktorá sa pošle všetkým vybraným..."
                    className="w-full bg-[#fcfaf8] border border-[#3E2E48]/10 rounded-2xl py-3 px-4 text-sm font-medium text-[#3E2E48] placeholder:text-[#3E2E48]/35 outline-none focus:border-[#d0a91a] transition-all"
                />

                <div className="mt-5 flex justify-end">
                    <button
                        type="button"
                        disabled={selectedUsers.length === 0 || !bulkText.trim()}
                        onClick={() => void onSendBulk()}
                        className="rounded-2xl bg-[#d0a91a] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#d0a91a]/20 transition hover:translate-y-[-1px] hover:shadow-xl disabled:opacity-50"
                    >
                        Odoslať všetkým
                    </button>
                </div>
            </div>
        </div>
    );
}