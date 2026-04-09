import { NextRequest, NextResponse } from "next/server";
import { serverApiFetch } from "@/lib/server-api";

export async function POST(req: NextRequest) {
    const cookie = req.headers.get("cookie") ?? "";
    const body = await req.json();

    const result = await serverApiFetch({
        path: "/api/chat/send-bulk",
        method: "POST",
        headers: {
            cookie,
            "Content-Type": "application/json",
            accept: "application/json",
        },
        body: JSON.stringify(body),
    });

    return NextResponse.json(result.data, { status: result.status });
}