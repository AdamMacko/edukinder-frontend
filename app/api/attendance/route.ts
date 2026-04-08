import { NextRequest, NextResponse } from "next/server";
import { serverApiFetch } from "@/lib/server-api";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const cookie = req.headers.get("cookie") ?? "";

    const query = new URLSearchParams();
    if (date) query.set("date", date);

    const result = await serverApiFetch({
        path: `/api/attendance?${query.toString()}`,
        method: "GET",
        headers: {
            cookie,
        },
    });

    return NextResponse.json(result.data, { status: result.status });
}

export async function POST(req: NextRequest) {
    const cookie = req.headers.get("cookie") ?? "";
    const body = await req.json();

    const result = await serverApiFetch({
        path: "/api/attendance",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            cookie,
        },
        body: JSON.stringify(body),
    });

    return NextResponse.json(result.data, { status: result.status });
}