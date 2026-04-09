import { NextRequest, NextResponse } from "next/server";
import { serverApiFetch } from "@/lib/server-api";

export async function GET(req: NextRequest) {
    const cookie = req.headers.get("cookie") ?? "";
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";

    const query = new URLSearchParams();
    if (q) query.set("q", q);

    const result = await serverApiFetch({
        path: `/api/chat/users?${query.toString()}`,
        method: "GET",
        headers: {
            cookie,
            accept: "application/json",
        },
    });

    return NextResponse.json(result.data, { status: result.status });
}