import { NextRequest, NextResponse } from "next/server";
import { serverApiFetch } from "@/lib/server-api";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const result = await serverApiFetch({
        path: "/api/auth/login/request",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    return NextResponse.json(result.data, { status: result.status });
}