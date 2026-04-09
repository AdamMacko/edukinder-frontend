export type CourseKey = "snack_am" | "lunch" | "snack_pm" | "full_day";
export type Meals = Record<CourseKey, boolean>;

export type ApiChild = {
    id: number;
    firstName: string;
    lastName: string;
};

export async function getMyChildren() {
    const res = await fetch("/api/child/mine", {
        credentials: "include",
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
        throw new Error(json.error || `HTTP ${res.status}`);
    }

    return json.data as ApiChild[];
}

export async function getMealsAttendance(params: {
    from: string;
    to: string;
    childIds: string;
}) {
    const query = new URLSearchParams({
        from: params.from,
        to: params.to,
        childIds: params.childIds,
    });

    const res = await fetch(`/api/meals/attendance?${query.toString()}`, {
        credentials: "include",
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
        throw new Error(json.error || `HTTP ${res.status}`);
    }

    return json.data as Record<string, Record<string, Meals>>;
}

export async function saveMealsAttendance(body: {
    date: string;
    entries: {
        childId: number;
        meals: {
            snack_am: boolean;
            lunch: boolean;
            snack_pm: boolean;
        };
    }[];
}) {
    const res = await fetch("/api/meals/attendance", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || (json && json.success === false)) {
        throw new Error(json?.error || `HTTP ${res.status}`);
    }

    return json;
}