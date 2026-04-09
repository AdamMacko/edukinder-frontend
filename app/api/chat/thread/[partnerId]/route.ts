import { NextRequest, NextResponse } from "next/server";
import { serverApiFetch } from "@/lib/server-api";

type Params = {
    params: Promise<{
        partnerId: string;
    }>;
};

export async function GET(req: NextRequest, { params }: Params) {
    const cookie = req.headers.get("cookie") ?? "";
    const { partnerId } = await params;

    const result = await serverApiFetch({
        path: `/api/chat/thread/${partnerId}`,
        method: "GET",
        headers: {
            cookie,
            accept: "application/json",
        },
    });

    return NextResponse.json(result.data, { status: result.status });
}