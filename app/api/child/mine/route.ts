import { NextRequest, NextResponse } from "next/server";
import { serverApiFetch } from "@/lib/server-api";

export async function GET(req: NextRequest) {
    const cookie = req.headers.get("cookie") ?? "";

    console.log("NEXT /api/child/mine incoming cookie:", cookie);

    const result = await serverApiFetch({
        path: "/api/child/mine",
        method: "GET",
        headers: {
            cookie,
            accept: "application/json",
        },
    });

    console.log("NEXT /api/child/mine backend status:", result.status);
    console.log("NEXT /api/child/mine backend data:", result.data);

    return NextResponse.json(result.data, { status: result.status });
}