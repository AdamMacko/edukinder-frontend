"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, Pin, MoreHorizontal, Globe, Users, Lock } from "lucide-react";
import { AnnouncementComments } from "./AnnouncementComments";
import { Announcement } from "@/lib/api/announcements"; // ZMENA 1: Správny typ z API

export const AnnouncementCard = ({ data }: { data: Announcement }) => {
    // ZMENA 2: Backend nám posiela boolean v 'likedByMe' (namiesto isLikedByMe)
    const [liked, setLiked] = useState(data.likedByMe || false);
    const [likesCount, setLikesCount] = useState(data.likesCount);

    const [showComments, setShowComments] = useState(false);

    const handleLike = () => {
        // TODO: Neskôr sem pridáme reálne volanie na backend: toggleAnnouncementLike(data.id)
        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    };

    // ZMENA 3: Ošetrenie chýbajúcich dát. Backend môže teoreticky poslať author = null
    const authorFirstName = data.author?.firstName || "Neznámy";
    const authorLastName = data.author?.lastName || "Používateľ";
    const initial = authorFirstName[0] + (authorLastName[0] || "");
    // Vytiahneme rolu ak existuje, inak dáme predvolenú
    const authorRole = (data.author as any)?.role || "Učiteľ";

    // ZMENA 4: Prispôsobenie na backendové stringy pre viditeľnosť
    const renderVisibilityBadge = () => {
        switch (data.visibility) {
            case "SELECTED_CLASSES":
                // ZMENA 5: Backend neposiela 'targetClass', ale pole 'audiences'
                const className = data.audiences?.[0]?.className || "Vybraná trieda";
                return (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#e3f0fb] text-[#2b74b1] text-[10px] font-black uppercase tracking-wider">
                        <Users className="w-3 h-3" /> {className}
                    </span>
                );
            case "STAFF_ONLY":
                return (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#fbe7e7] text-[#b15252] text-[10px] font-black uppercase tracking-wider">
                        <Lock className="w-3 h-3" /> Zamestnanci
                    </span>
                );
            case "ALL_USERS":
            default:
                return (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#f4fbef] text-[#547a31] text-[10px] font-black uppercase tracking-wider">
                        <Globe className="w-3 h-3" /> Všetci
                    </span>
                );
        }
    };

    return (
        <div className="relative bg-white rounded-[32px] p-5 sm:p-6 shadow-sm border border-[#3E2E48]/5 transition-all hover:shadow-md mb-4 group">

            {data.pinned && (
                <div className="flex items-center gap-2 mb-3 text-[#d0a91a] text-xs font-bold ml-12">
                    <Pin className="w-3.5 h-3.5 fill-[#d0a91a]" /> Pripnutý oznam
                </div>
            )}

            <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-[#fcf7f3] border border-[#3E2E48]/10 text-[#3E2E48] flex items-center justify-center font-black text-sm">
                    {initial}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-bold text-[#3E2E48] text-[15px] leading-tight">
                                {authorFirstName} {authorLastName}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-[#3E2E48]/50 text-xs hidden sm:inline">•</span>
                                <span className="text-[#3E2E48]/50 text-xs">{authorRole}</span>
                                {renderVisibilityBadge()}
                            </div>
                        </div>
                        <button className="text-[#3E2E48]/30 hover:text-[#3E2E48] transition-colors p-1 -mr-2 -mt-1">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="text-[#3E2E48]/40 text-xs mb-3">
                        {new Date(data.createdAt).toLocaleDateString("sk-SK", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                    </div>

                    <div className="mb-4">
                        <h3 className="font-black text-[#3E2E48] text-lg mb-1 leading-snug">{data.title}</h3>
                        <p className="text-[#3E2E48]/80 text-[15px] leading-relaxed whitespace-pre-wrap">
                            {data.body}
                        </p>
                    </div>

                    {/* AKCIE */}
                    <div className="flex items-center gap-6 mt-2 pt-4 border-t border-[#3E2E48]/5">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 group/btn transition-colors ${liked ? 'text-[#e45b5b]' : 'text-[#3E2E48]/50 hover:text-[#e45b5b]'}`}
                        >
                            <div className={`p-2 rounded-full transition-colors ${liked ? 'bg-[#fbe7e7]' : 'group-hover/btn:bg-[#fbe7e7]'}`}>
                                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} strokeWidth={2.5} />
                            </div>
                            <span className="text-sm font-semibold">{likesCount > 0 && likesCount}</span>
                        </button>

                        <button
                            onClick={() => setShowComments(!showComments)}
                            className={`flex items-center gap-2 group/btn transition-colors ${showComments ? 'text-[#d0a91a]' : 'text-[#3E2E48]/50 hover:text-[#d0a91a]'}`}
                        >
                            <div className={`p-2 rounded-full transition-colors ${showComments ? 'bg-[#d0a91a]/10' : 'group-hover/btn:bg-[#d0a91a]/10'}`}>
                                <MessageCircle className={`w-4 h-4 ${showComments ? 'fill-[#d0a91a]/20' : ''}`} strokeWidth={2.5} />
                            </div>
                            <span className="text-sm font-semibold">
                                {/* ZMENA 6: Backend vracia len číslo, pole komentárov nenačítava hneď */}
                                {data.commentsCount > 0 && data.commentsCount}
                            </span>
                        </button>

                        <button className="flex items-center gap-2 text-[#3E2E48]/50 hover:text-[#3E2E48] group/btn transition-colors ml-auto">
                            <div className="p-2 rounded-full group-hover/btn:bg-[#3E2E48]/5 transition-colors">
                                <Share2 className="w-4 h-4" strokeWidth={2.5} />
                            </div>
                        </button>
                    </div>

                    {/* Podmienené vykreslenie komponentu komentárov */}
                    {showComments && (
                        <AnnouncementComments announcementId={data.id} />
                    )}

                </div>
            </div>
        </div>
    );
};