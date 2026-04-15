// lib/api/announcements.ts
import { apiFetch } from "@/lib/api/client";
export type AnnouncementAuthor = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
};

export type AnnouncementAudience = {
  classId: number;
  className: string | null;
  classLabel: string | null;
};

export type Announcement = {
  id: number;
  title: string;
  body: string;
  visibility: "ALL_USERS" | "SELECTED_CLASSES" | "STAFF_ONLY";
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author: AnnouncementAuthor | null;
  audiences: AnnouncementAudience[];
  likesCount: number;
  commentsCount: number;
  likedByMe: boolean;
};

// Získanie hlavného feedu (nástenky)
export async function fetchAnnouncements(): Promise<Announcement[]> {
  // Tu používame náš apiFetch namiesto obyčajného fetch
  const json = await apiFetch("/api/announcement/feed");
  return json.data;
}


export type AnnouncementComment = {
  id: number;
  announcementId: number;
  body: string;
  createdAt: string;
  authorId: number;
  author: AnnouncementAuthor | null;
  likesCount: number;
  likedByMe: boolean;
};
// Získanie komentárov pre konkrétny oznam
export async function fetchComments(announcementId: number): Promise<AnnouncementComment[]> {
  const json = await apiFetch(`/api/announcement/${announcementId}/comments`);
  return json.data;
}

// Pridanie nového komentára
export async function addComment(announcementId: number, body: string): Promise<AnnouncementComment> {
  const json = await apiFetch(`/api/announcement/${announcementId}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
  return json.data;
}

// Lajkovanie komentára
export async function toggleCommentLike(commentId: number): Promise<{ liked: boolean }> {
  // Tu vraciame rovno celý json, lebo backend posiela { success: true, liked: true/false }
  const json = await apiFetch(`/api/announcement/comments/${commentId}/like`, { method: "POST" });
  return json;
}

// Pre istotu - Lajkovanie samotného OZNAMU (ak to tam máš)
export async function toggleAnnouncementLike(id: number): Promise<{ liked: boolean }> {
  const json = await apiFetch(`/api/announcement/${id}/like`, { method: "POST" });
  return json;
}

export async function createAnnouncement(data: any): Promise<Announcement> {
  const json = await apiFetch("/api/announcement", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return json.data;
}