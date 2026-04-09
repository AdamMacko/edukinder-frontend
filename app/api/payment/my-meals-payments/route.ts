import { NextRequest, NextResponse } from "next/server";
import { serverApiFetch } from "@/lib/server-api";

export async function GET(req: NextRequest) {
    const cookie = req.headers.get("cookie") ?? "";

    const result = await serverApiFetch({
        path: "/api/payment/my-meals-payments",
        method: "GET",
        headers: {
            cookie,
            accept: "application/json",
        },
    });

    return NextResponse.json(result.data, { status: result.status });
}