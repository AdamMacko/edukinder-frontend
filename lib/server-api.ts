const API_BASE = process.env.API_BASE ?? "";
// Tu načítame URL frontendu, fallback je localhost
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type ServerApiOptions = RequestInit & {
    path: string;
};

export async function serverApiFetch({ path, ...options }: ServerApiOptions) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            ...(options.headers ?? {}),
            // ✅ Táto hlavička povie tvojmu backendu na Renderi, kde beží frontend
            "x-forwarded-host": SITE_URL,
        },
        cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    return {
        ok: res.ok,
        status: res.status,
        data,
        headers: res.headers,
    };
}

export async function serverApiFetchRaw({ path, ...options }: ServerApiOptions) {
    return fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            ...(options.headers ?? {}),
            "x-forwarded-host": SITE_URL,
        },
        cache: "no-store",
    });
}