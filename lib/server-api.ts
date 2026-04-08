const API_BASE = process.env.API_BASE ?? "";

type ServerApiOptions = RequestInit & {
    path: string;
};

export async function serverApiFetch({ path, ...options }: ServerApiOptions) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            ...(options.headers ?? {}),
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
        },
        cache: "no-store",
    });
}