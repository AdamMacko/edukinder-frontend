import { NextRequest, NextResponse } from "next/server";
import { serverApiFetchRaw } from "@/lib/server-api";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    const backendRes = await serverApiFetchRaw({
        path: `/api/auth/login/verify?token=${encodeURIComponent(token)}`,
        method: "GET",
        redirect: "manual",
    });

    const response = NextResponse.redirect(new URL("/", req.url));

    const setCookies =
        typeof backendRes.headers.getSetCookie === "function"
            ? backendRes.headers.getSetCookie()
            : [];

    if (setCookies.length > 0) {
        for (const cookie of setCookies) {
            response.headers.append("set-cookie", cookie);
        }
    } else {
        const single = backendRes.headers.get("set-cookie");
        if (single) {
            response.headers.append("set-cookie", single);
        }
    }

    return response;
}