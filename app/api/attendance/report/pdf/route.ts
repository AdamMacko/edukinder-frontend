import { NextRequest } from "next/server";
import { serverApiFetchRaw } from "@/lib/server-api";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const cookie = req.headers.get("cookie") ?? "";

    const query = new URLSearchParams();
    if (month) query.set("month", month);

    const res = await serverApiFetchRaw({
        path: `/api/attendance/report/pdf?${query.toString()}`,
        method: "GET",
        headers: {
            cookie,
        },
    });

    const arrayBuffer = await res.arrayBuffer();

    return new Response(arrayBuffer, {
        status: res.status,
        headers: {
            "Content-Type": res.headers.get("content-type") ?? "application/pdf",
            "Content-Disposition":
                res.headers.get("content-disposition") ??
                `attachment; filename="dochadzka_${month ?? "report"}.pdf"`,
        },
    });
}