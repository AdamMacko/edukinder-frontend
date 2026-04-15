export type TeacherMealStatementItem = {
    statementId: number;
    childId: number;
    childName: string;
    month: string;
    plannedDays: number;
    mealsAmount: number;
    carryOverIn: number;
    totalToPay: number;
    carryOverOut: number;
    status: "UNPAID" | "PARTIAL" | "PAID";
    paidAt: string | null;
};

type TeacherMealStatementsResponse = {
    className: string;
    month: string;
    items: TeacherMealStatementItem[];
};

function getErrorMessage(data: unknown, fallback: string) {
    if (
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof (data as { error?: unknown }).error === "string"
    ) {
        return (data as { error: string }).error;
    }
    return fallback;
}

export async function getTeacherClassMealStatements(month: string) {
    const res = await fetch(
        `/api/payment/teacher-class-meal-statements?month=${encodeURIComponent(month)}`,
        {
            credentials: "include",
            cache: "no-store",
        }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
        throw new Error(getErrorMessage(data, "Nepodarilo sa načítať platby triedy."));
    }

    return data.data as TeacherMealStatementsResponse;
}

export async function markTeacherMealStatementPaid(payload: {
    childId: number;
    month: string;
}) {
    const res = await fetch("/api/payment/teacher-class-meal-statements", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
        console.error("markTeacherMealStatementPaid error:", {
            status: res.status,
            data,
            payload,
        });

        throw new Error(getErrorMessage(data, `Nepodarilo sa potvrdiť úhradu. HTTP ${res.status}`));
    }

    return data.data as {
        paymentId?: number;
        statementId: number;
        status: "UNPAID" | "PARTIAL" | "PAID";
        paidAt: string | null;
        alreadyPaid?: boolean;
    };
}