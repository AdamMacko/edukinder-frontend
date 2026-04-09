import { NextRequest, NextResponse } from "next/server";
import { serverApiFetch } from "@/lib/server-api";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const cookie = req.headers.get("cookie") ?? "";

    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const childIds = searchParams.get("childIds");

    const query = new URLSearchParams();
    if (from) query.set("from", from);
    if (to) query.set("to", to);
    if (childIds) query.set("childIds", childIds);

    const result = await serverApiFetch({
        path: `/api/meals/attendance?${query.toString()}`,
        method: "GET",
        headers: {
            cookie,
            accept: "application/json",
        },
    });

    return NextResponse.json(result.data, { status: result.status });
}

export async function POST(req: NextRequest) {
    const cookie = req.headers.get("cookie") ?? "";
    const body = await req.json();

    const result = await serverApiFetch({
        path: "/api/meals/attendance",
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