"use client";

import { useState } from "react";
import { Heart, Send } from "lucide-react";
import { AnnouncementCommentMock, currentUser } from "@/app/announcements/mockData";

export const AnnouncementComments = ({ initialComments }: { initialComments: AnnouncementCommentMock[] }) => {
  const [comments, setComments] = useState<AnnouncementCommentMock[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleLike = (commentId: number) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        const isLiked = !c.isLikedByMe;
        return { ...c, isLikedByMe: isLiked, likesCount: c.likesCount + (isLiked ? 1 : -1) };
      }
      return c;
    }));
  };

  const handleSend = () => {
    if (!newComment.trim()) return;
    
    const newObj: AnnouncementCommentMock = {
      id: Date.now(),
      author: currentUser,
      body: newComment.trim(),
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLikedByMe: false,
    };
    
    setComments([...comments, newObj]);
    setNewComment("");
  };

  return (
    <div className="mt-4 pt-4 border-t border-[#3E2E48]/5 animate-in slide-in-from-top-4 fade-in duration-300">
      {/* Zoznam komentárov */}
      <div className="space-y-4 mb-4">
        {comments.length === 0 ? (
          <p className="text-sm text-[#3E2E48]/40 text-center py-2">Zatiaľ žiadne komentáre. Buďte prvý!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group/comment">
              <div className="w-8 h-8 shrink-0 rounded-full bg-[#fcf7f3] border border-[#3E2E48]/10 text-[#3E2E48] flex items-center justify-center font-bold text-xs">
                {comment.author.firstName[0]}{comment.author.lastName?.[0] || ""}
              </div>
              
              <div className="flex-1">
                <div className="bg-[#fcf7f3] rounded-2xl rounded-tl-none px-4 py-2.5">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-[#3E2E48] text-sm">
                      {comment.author.firstName} {comment.author.lastName}
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
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${comment.isLikedByMe ? 'text-[#e45b5b]' : 'text-[#3E2E48]/40 hover:text-[#e45b5b]'}`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${comment.isLikedByMe ? 'fill-current' : ''}`} />
                    {comment.likesCount > 0 && comment.likesCount}
                  </button>
                  <button className="text-[11px] font-bold text-[#3E2E48]/40 hover:text-[#3E2E48] transition-colors">
                    Odpovedať
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

     {/* Pridanie nového komentára */}
      <div className="flex items-center gap-3 mt-2">
        <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-[#d0a91a] to-[#e2c26a] text-white flex items-center justify-center font-black text-xs shadow-sm">
          {currentUser.firstName[0]}{currentUser.lastName?.[0] || ""}
        </div>
        

        <div className="flex-1 relative flex items-center">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Napíšte komentár..."
           
            className="w-full bg-[#fcf7f3] border border-[#3E2E48]/10 rounded-[24px] pl-4 pr-11 py-3 text-[15px] text-[#3E2E48] placeholder:text-[#3E2E48]/40 outline-none focus:border-[#d0a91a] focus:ring-4 focus:ring-[#d0a91a]/10 resize-none transition-all scrollbar-hide leading-snug m-0"
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
            disabled={!newComment.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full text-white bg-[#d0a91a] disabled:opacity-50 disabled:bg-[#3E2E48]/10 disabled:text-[#3E2E48]/40 transition-all hover:bg-[#b89517] hover:scale-105 active:scale-95 shadow-sm"
          >
          
            <Send className="w-[15px] h-[15px] ml-[2px]" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};