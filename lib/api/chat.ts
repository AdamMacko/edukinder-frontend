export type Me = { id: number } | null;

export type Conversation = {
    partnerId: number;
    partnerName: string;
    lastMessage: string;
    lastAt: string;
    unreadCount: number;
};

export type ThreadMsg = {
    id: number;
    senderId: number;
    recipientId: number;
    value: string;
    createdAt: string;
    readAt: string | null;
    isAttachment: boolean;
    attachmentName: string | null;
    attachmentMime: string | null;
    attachmentSize: number | null;
};

export type UserPick = {
    id: number;
    name: string;
    email: string;
};

type ApiOk<T> = { success: true; data: T };
type ApiErr = { success: false; error?: string };
type ApiResponse<T> = ApiOk<T> | ApiErr;

type AuthMeResponse = {
    user: { id: number; email?: string; role?: string } | null;
    error?: string;
};

function isRecord(x: unknown): x is Record<string, unknown> {
    return typeof x === "object" && x !== null;
}

function parseApiResponse<T>(json: unknown): ApiResponse<T> {
    if (!isRecord(json)) return { success: false, error: "Invalid response" };

    const success = json["success"];
    if (success === true) return { success: true, data: json["data"] as T };

    if (success === false) {
        const errorVal = json["error"];
        return {
            success: false,
            error: typeof errorVal === "string" ? errorVal : undefined,
        };
    }

    return { success: false, error: "Invalid response" };
}

function parseAuthMe(json: unknown): AuthMeResponse {
    if (!isRecord(json)) return { user: null, error: "Invalid response" };

    const userVal = json["user"];

    if (userVal === null) {
        const err = json["error"];
        return { user: null, error: typeof err === "string" ? err : undefined };
    }

    if (isRecord(userVal)) {
        const idVal = userVal["id"];
        if (typeof idVal === "number") {
            return {
                user: {
                    id: idVal,
                    email: typeof userVal["email"] === "string" ? userVal["email"] : undefined,
                    role: typeof userVal["role"] === "string" ? userVal["role"] : undefined,
                },
            };
        }
    }

    return { user: null, error: "Invalid user payload" };
}

export function getErrorMessage(e: unknown): string {
    if (e instanceof Error) return e.message;
    if (typeof e === "string") return e;
    return "Nastala neočakávaná chyba.";
}

export function fmtDateTime(iso: string) {
    return new Intl.DateTimeFormat("sk-SK", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(iso));
}

export function fmtShortTime(iso: string) {
    return new Intl.DateTimeFormat("sk-SK", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(iso));
}

export async function fetchMe() {
    const res = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
    });

    const raw: unknown = await res.json().catch(() => null);
    const parsed = parseAuthMe(raw);

    if (!res.ok && parsed.error) throw new Error(parsed.error);

    return parsed.user?.id ? ({ id: parsed.user.id } as Me) : null;
}

export async function fetchConversations() {
    const res = await fetch("/api/chat/conversations", {
        credentials: "include",
    });

    const raw: unknown = await res.json();
    const parsed = parseApiResponse<unknown>(raw);

    if (!res.ok || parsed.success === false) {
        throw new Error(parsed.success === false ? parsed.error ?? "Fetch failed" : "Fetch failed");
    }

    if (!Array.isArray(parsed.data)) return [] as Conversation[];

    return parsed.data
        .map((x) => (isRecord(x) ? x : null))
        .filter((x): x is Record<string, unknown> => x !== null)
        .map((x) => ({
            partnerId: typeof x["partnerId"] === "number" ? x["partnerId"] : -1,
            partnerName: typeof x["partnerName"] === "string" ? x["partnerName"] : "",
            lastMessage: typeof x["lastMessage"] === "string" ? x["lastMessage"] : "",
            lastAt: typeof x["lastAt"] === "string" ? x["lastAt"] : String(x["lastAt"] ?? ""),
            unreadCount: typeof x["unreadCount"] === "number" ? x["unreadCount"] : 0,
        }))
        .filter((c) => c.partnerId !== -1);
}

export async function fetchThread(partnerId: number) {
    const res = await fetch(`/api/chat/thread/${partnerId}`, {
        credentials: "include",
    });

    const raw: unknown = await res.json();
    const parsed = parseApiResponse<unknown>(raw);

    if (!res.ok || parsed.success === false) {
        throw new Error(parsed.success === false ? parsed.error ?? "Fetch failed" : "Fetch failed");
    }

    if (!Array.isArray(parsed.data)) return [] as ThreadMsg[];

    return parsed.data
        .map((x) => (isRecord(x) ? x : null))
        .filter((x): x is Record<string, unknown> => x !== null)
        .map((x) => ({
            id: typeof x["id"] === "number" ? x["id"] : -1,
            senderId: typeof x["senderId"] === "number" ? x["senderId"] : -1,
            recipientId: typeof x["recipientId"] === "number" ? x["recipientId"] : -1,
            value: typeof x["value"] === "string" ? x["value"] : "",
            createdAt: typeof x["createdAt"] === "string" ? x["createdAt"] : String(x["createdAt"] ?? ""),
            readAt: typeof x["readAt"] === "string" ? x["readAt"] : null,
            isAttachment: typeof x["isAttachment"] === "boolean" ? x["isAttachment"] : false,
            attachmentName: typeof x["attachmentName"] === "string" ? x["attachmentName"] : null,
            attachmentMime: typeof x["attachmentMime"] === "string" ? x["attachmentMime"] : null,
            attachmentSize: typeof x["attachmentSize"] === "number" ? x["attachmentSize"] : null,
        }))
        .filter((m) => m.id !== -1);
}

export async function markRead(partnerId: number) {
    await fetch(`/api/chat/mark-read/${partnerId}`, {
        method: "POST",
        credentials: "include",
    });
}

export async function deleteConversation(partnerId: number) {
    const res = await fetch(`/api/chat/conversation/${partnerId}`, {
        method: "DELETE",
        credentials: "include",
    });

    const raw: unknown = await res.json().catch(() => null);
    const parsed = parseApiResponse<unknown>(raw);

    if (!res.ok || parsed.success === false) {
        throw new Error(parsed.success === false ? parsed.error ?? "Delete failed" : "Delete failed");
    }
}

export async function searchUsers(q: string, myId?: number | null) {
    const res = await fetch(`/api/chat/users?q=${encodeURIComponent(q)}`, {
        credentials: "include",
    });

    const raw: unknown = await res.json();
    const parsed = parseApiResponse<unknown>(raw);

    if (!res.ok || parsed.success === false) {
        throw new Error(parsed.success === false ? parsed.error ?? "Fetch failed" : "Fetch failed");
    }

    if (!Array.isArray(parsed.data)) return [] as UserPick[];

    return parsed.data
        .map((x) => (isRecord(x) ? x : null))
        .filter((x): x is Record<string, unknown> => x !== null)
        .map((x) => ({
            id: typeof x["id"] === "number" ? x["id"] : -1,
            name: typeof x["name"] === "string" ? x["name"] : "",
            email: typeof x["email"] === "string" ? x["email"] : "",
        }))
        .filter((u) => u.id !== -1)
        .filter((u) => (myId != null ? u.id !== myId : true));
}

export async function sendBulkMessage(recipientIds: number[], value: string) {
    const res = await fetch("/api/chat/send-bulk", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientIds, value }),
    });

    const raw: unknown = await res.json();
    const parsed = parseApiResponse<{ sentTo: number }>(raw);

    if (!res.ok || parsed.success === false) {
        throw new Error(parsed.success === false ? parsed.error ?? "Failed" : "Failed");
    }

    return parsed.data;
}

export async function sendMessage(params: {
    recipientId: number;
    value?: string;
    file?: File | null;
}) {
    const { recipientId, value = "", file = null } = params;

    let res: Response;

    if (file) {
        const fd = new FormData();
        fd.append("recipientId", String(recipientId));
        if (value.trim()) fd.append("value", value.trim());
        fd.append("file", file);

        res = await fetch("/api/chat/send", {
            method: "POST",
            credentials: "include",
            body: fd,
        });
    } else {
        res = await fetch("/api/chat/send", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipientId, value: value.trim() }),
        });
    }

    const raw: unknown = await res.json();
    const parsed = parseApiResponse<unknown>(raw);

    if (!res.ok || parsed.success === false) {
        throw new Error(parsed.success === false ? parsed.error ?? "Failed to send" : "Failed to send");
    }

    return parsed;
}