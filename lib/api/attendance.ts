import {
    AttendanceResponse,
    MonthlyReport,
} from "@/app/types/attendance";

const jsonHeaders = {
    "Content-Type": "application/json",
};

export async function getAttendanceByDate(date: string) {
    const res = await fetch(`/api/attendance?date=${encodeURIComponent(date)}`, {
        credentials: "include",
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
        throw new Error(json.error || "Nepodarilo sa načítať dochádzku.");
    }

    return json.data as AttendanceResponse;
}

export async function toggleAttendance(date: string, childId: number) {
    const res = await fetch("/api/attendance", {
        method: "POST",
        credentials: "include",
        headers: jsonHeaders,
        body: JSON.stringify({ date, childId }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
        throw new Error(json.error || "Nepodarilo sa uložiť dochádzku.");
    }

    return json.data as {
        attendance: { childId: number; state: "PRESENT" | "ABSENT" | "SICK" };
        log: {
            id: number;
            timestamp: string;
            childName: string;
            from: "PRESENT" | "ABSENT" | "SICK";
            to: "PRESENT" | "ABSENT" | "SICK";
            userEmail: string;
        };
    };
}

export async function getAttendanceMonthlyReport(month: string) {
    const res = await fetch(
        `/api/attendance/report?month=${encodeURIComponent(month)}`,
        {
            credentials: "include",
        }
    );

    const json = await res.json();

    if (!res.ok || !json.success) {
        throw new Error(json.error || "Nepodarilo sa načítať prehľad.");
    }

    return json.data as MonthlyReport;
}

export async function downloadAttendanceMonthlyPdf(month: string) {
    const res = await fetch(
        `/api/attendance/report/pdf?month=${encodeURIComponent(month)}`,
        {
            credentials: "include",
        }
    );

    if (!res.ok) {
        throw new Error("Nepodarilo sa stiahnuť PDF.");
    }

    return res.blob();
}