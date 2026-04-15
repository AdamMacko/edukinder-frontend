import { NextRequest, NextResponse } from "next/server";
import { serverApiFetchRaw } from "@/lib/server-api";

type Params = {
    params: Promise<{
        messageId: string;
    }>;
};

export async function GET(req: NextRequest, { params }: Params) {
    const cookie = req.headers.get("cookie") ?? "";
    const { messageId } = await params;

    const backendRes = await serverApiFetchRaw({
        path: `/api/chat/file/${messageId}`,
        method: "GET",
        headers: {
            cookie,
        },
    });

    return new NextResponse(backendRes.body, {
        status: backendRes.status,
        headers: backendRes.headers,
    });
}