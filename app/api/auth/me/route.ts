import { NextRequest, NextResponse } from "next/server";
import { serverApiFetch } from "@/lib/server-api";

export async function GET(req: NextRequest) {
    const cookie = req.headers.get("cookie") ?? "";

    const result = await serverApiFetch({
        path: "/api/auth/me",
        method: "GET",
        headers: {
            cookie,
            accept: "application/json",
        },
    });

    return NextResponse.json(result.data, { status: result.status });
}