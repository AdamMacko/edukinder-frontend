export type MealStatementStatus = "UNPAID" | "PARTIAL" | "PAID";

export type RawMealStatementFromApi = {
    id: number;
    childId: number;
    childName: string;
    month: string;
    plannedDays: number;
    mealsAmount: string | number;
    carryOverIn: string | number;
    totalToPay: string | number;
    carryOverOut: string | number;
    status: MealStatementStatus;
    qrPayload?: string | null;
    paymentDetails?: {
        recipientName: string;
        iban: string;
        vs: string;
        amount: number;
        note: string;
    };
};

export type RawMealsPaymentFromApi = {
    id: number;
    childId: number;
    childName: string;
    amount: string | number;
    paidAt: string;
};

export async function getMyMealStatements() {
    const res = await fetch("/api/payment/my-meal-statements", {
        method: "GET",
        credentials: "include",
    });

    const text = await res.text();
    let json: any = null;
    try {
        json = text ? JSON.parse(text) : null;
    } catch {}

    if (!res.ok || !json?.success) {
        throw new Error(json?.error || json?.message || `HTTP ${res.status}`);
    }

    return (Array.isArray(json.data) ? json.data : []) as RawMealStatementFromApi[];
}

export async function getMyMealsPayments() {
    const res = await fetch("/api/payment/my-meals-payments", {
        method: "GET",
        credentials: "include",
    });

    const text = await res.text();
    let json: any = null;
    try {
        json = text ? JSON.parse(text) : null;
    } catch {}

    if (!res.ok || !json?.success) {
        throw new Error(json?.error || json?.message || `HTTP ${res.status}`);
    }

    return (Array.isArray(json.data) ? json.data : []) as RawMealsPaymentFromApi[];
}