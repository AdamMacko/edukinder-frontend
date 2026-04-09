import { NextRequest, NextResponse } from "next/server";
import { serverApiFetchRaw } from "@/lib/server-api";

export async function POST(req: NextRequest) {
    const cookie = req.headers.get("cookie") ?? "";
    const contentType = req.headers.get("content-type") ?? "";

    let backendRes: Response;

    if (contentType.includes("multipart/form-data")) {
        const formData = await req.formData();

        backendRes = await serverApiFetchRaw({
            path: "/api/chat/send",
            method: "POST",
            headers: {
                cookie,
            },
            body: formData,
        });
    } else {
        const body = await req.text();

        backendRes = await serverApiFetchRaw({
            path: "/api/chat/send",
            method: "POST",
            headers: {
                cookie,
                "Content-Type": "application/json",
                accept: "application/json",
            },
            body,
        });
    }

    const text = await backendRes.text();

    return new NextResponse(text, {
        status: backendRes.status,
        headers: {
            "Content-Type":
                backendRes.headers.get("content-type") ?? "application/json",
        },
    });
}