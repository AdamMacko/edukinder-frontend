import { NextRequest, NextResponse } from "next/server";
import { serverApiFetch } from "@/lib/server-api";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const cookie = req.headers.get("cookie") ?? "";

    const query = new URLSearchParams();
    if (month) query.set("month", month);

    const result = await serverApiFetch({
        path: `/api/payment/teacher-class-meal-statements?${query.toString()}`,
        method: "GET",
        headers: {
            cookie,
        },
    });

    return NextResponse.json(result.data, { status: result.status });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const cookie = req.headers.get("cookie") ?? "";

    const result = await serverApiFetch({
        path: "/api/payment/teacher-class-meal-statements/mark-paid",
        method: "POST",
        headers: {
            cookie,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    return NextResponse.json(result.data, { status: result.status });
}