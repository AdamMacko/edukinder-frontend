"use client";

import { useState, useEffect } from "react";
import { Heart, Send, Loader2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { 
  fetchComments, 
  addComment, 
  toggleCommentLike, 
  type AnnouncementComment 
} from "@/lib/api/announcements";

export const AnnouncementComments = ({ announcementId }: { announcementId: number }) => {
  const { user } = useAuth();
  
  const [comments, setComments] = useState<AnnouncementComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Načítanie komentárov po rozbalení
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const data = await fetchComments(announcementId);
        if (isMounted) setComments(data);
      } catch (error) {
        console.error("Chyba pri načítaní komentárov:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadData();
    
    return () => { isMounted = false; };
  }, [announcementId]);

  // 2. Bleskové lajkovanie (Optimistic UI)
  const handleLike = async (commentId: number) => {
    const previousComments = [...comments];
    
    // Okamžitá zmena UI
    setComments(comments.map(c => {
      if (c.id === commentId) {
        const isLiked = !c.likedByMe;
        return { ...c, likedByMe: isLiked, likesCount: c.likesCount + (isLiked ? 1 : -1) };
      }
      return c;
    }));

    try {
      // Potichu na pozadí povieme serveru
      await toggleCommentLike(commentId);
    } catch (error) {
      // Ak zlyhá internet, vrátime zmenu späť
      setComments(previousComments);
    }
  };

  // 3. Odoslanie komentára
  const handleSend = async () => {
    if (!newComment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const added = await addComment(announcementId, newComment);
      setComments([...comments, added]);
      setNewComment("");
    } catch (error) {
      alert("Nepodarilo sa pridať komentár. Skúste to prosím znova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Získanie iniciál prihláseného používateľa
  const myInitial = user ? (user.firstName?.charAt(0) || user.email?.charAt(0) || "U").toUpperCase() : "U";

  return (
    <div className="mt-4 pt-4 border-t border-[#3E2E48]/5 animate-in slide-in-from-top-4 fade-in duration-300">
      
      {/* Zoznam komentárov / Loader */}
      <div className="space-y-4 mb-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-[#d0a91a]" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-[#3E2E48]/40 text-center py-2">Zatiaľ žiadne komentáre. Buďte prvý!</p>
        ) : (
          comments.map((comment) => {
            const authorFirst = comment.author?.firstName || "Neznámy";
            const authorLast = comment.author?.lastName || "";
            const commentInitial = (authorFirst.charAt(0) + (authorLast?.charAt(0) || "")).toUpperCase();

            return (
              <div key={comment.id} className="flex gap-3 group/comment">
                <div className="w-8 h-8 shrink-0 rounded-full bg-[#fcf7f3] border border-[#3E2E48]/10 text-[#3E2E48] flex items-center justify-center font-bold text-xs">
                  {commentInitial}
                </div>
                
                <div className="flex-1">
                  <div className="bg-[#fcf7f3] rounded-2xl rounded-tl-none px-4 py-2.5">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-bold text-[#3E2E48] text-sm">
                        {authorFirst} {authorLast}
                      </span>
                      <span className="text-[#3E2E48]/40 text-[10px] ml-2">
                        {new Date(comment.createdAt).toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-[#3E2E48]/80 text-sm whitespace-pre-wrap">{comment.body}</p>
                  </div>
                  
                  {/* Akcie pod komentárom */}
                  <div className="flex items-center gap-4 mt-1 px-2">
                    <button 
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${comment.likedByMe ? 'text-[#e45b5b]' : 'text-[#3E2E48]/40 hover:text-[#e45b5b]'}`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${comment.likedByMe ? 'fill-current' : ''}`} />
                      {comment.likesCount > 0 && comment.likesCount}
                    </button>
                    <button className="text-[11px] font-bold text-[#3E2E48]/40 hover:text-[#3E2E48] transition-colors">
                      Odpovedať
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pridanie nového komentára */}
      <div className="flex items-center gap-3 mt-2">
        <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-[#d0a91a] to-[#e2c26a] text-white flex items-center justify-center font-black text-xs shadow-sm">
          {myInitial}
        </div>
        
        <div className="flex-1 relative flex items-center">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
            placeholder="Napíšte komentár..."
            className="w-full bg-[#fcf7f3] border border-[#3E2E48]/10 rounded-[24px] pl-4 pr-11 py-3 text-[15px] text-[#3E2E48] placeholder:text-[#3E2E48]/40 outline-none focus:border-[#d0a91a] focus:ring-4 focus:ring-[#d0a91a]/10 resize-none transition-all scrollbar-hide leading-snug m-0 disabled:opacity-60"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button 
            onClick={handleSend}
            disabled={!newComment.trim() || isSubmitting}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full text-white bg-[#d0a91a] disabled:opacity-50 disabled:bg-[#3E2E48]/10 disabled:text-[#3E2E48]/40 transition-all hover:bg-[#b89517] hover:scale-105 active:scale-95 shadow-sm"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-[15px] h-[15px] ml-[2px]" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};