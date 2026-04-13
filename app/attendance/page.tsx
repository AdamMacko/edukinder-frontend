"use client";
import { Header } from "@/app/components/header/Header";
import { useEffect, useMemo, useState } from "react";
import { AttendanceHeader } from "../components/attendance/AttendanceHeader";
import { AttendanceToolbar } from "../components/attendance/AttendanceToolbar";
import { AttendanceGrid } from "../components/attendance/AttendanceGrid";
import { AttendanceHistoryTable } from "../components/attendance/AttendanceHistoryTable";
import {
    AttendanceLog,
    AttendanceResponse,
    AttendanceState,
    Child,
} from "../types/attendance";
import {
    downloadAttendanceMonthlyPdf,
    getAttendanceByDate,
    getAttendanceMonthlyReport,
    toggleAttendance,
} from "@/lib/api/attendance";

const WEEKDAYS = [
    "Nedeľa",
    "Pondelok",
    "Utorok",
    "Streda",
    "Štvrtok",
    "Piatok",
    "Sobota",
];

const MONTHS_SK = [
    "Január",
    "Február",
    "Marec",
    "Apríl",
    "Máj",
    "Jún",
    "Júl",
    "August",
    "September",
    "Október",
    "November",
    "December",
];

const pad = (n: number) => String(n).padStart(2, "0");
const keyOf = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const monthKeyOf = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;

export default function AttendancePage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const [groupName, setGroupName] = useState<string | null>(null);
    const [childrenList, setChildrenList] = useState<Child[]>([]);
    const [attendance, setAttendance] = useState<Record<string, AttendanceState>>(
        {}
    );
    const [logs, setLogs] = useState<AttendanceLog[]>([]);

    const [loading, setLoading] = useState(false);
    const [reportLoading, setReportLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dateKey = keyOf(selectedDate);

    const dayLabel = useMemo(() => {
        const weekday = WEEKDAYS[selectedDate.getDay()];
        const day = selectedDate.getDate();
        const month = MONTHS_SK[selectedDate.getMonth()];
        const year = selectedDate.getFullYear();
        return `${weekday}, ${day}. ${month} ${year}`;
    }, [selectedDate]);

    const counts = useMemo(() => {
        return childrenList.reduce(
            (acc, child) => {
                const state = attendance[String(child.id)] ?? "PRESENT";

                if (state === "PRESENT") acc.present += 1;
                if (state === "ABSENT") acc.absent += 1;
                if (state === "SICK") acc.sick += 1;

                return acc;
            },
            { present: 0, absent: 0, sick: 0 }
        );
    }, [childrenList, attendance]);

    const changeDay = (step: number) => {
        setSelectedDate((prev) => {
            const d = new Date(prev);
            do {
                d.setDate(d.getDate() + step);
            } while (d.getDay() === 0 || d.getDay() === 6);
            return d;
        });
    };

    useEffect(() => {
        let cancelled = false;

        const loadAttendance = async () => {
            try {
                setLoading(true);
                setError(null);

                const data: AttendanceResponse = await getAttendanceByDate(dateKey);

                if (cancelled) return;

                setGroupName(data.groupName ?? null);
                setChildrenList(data.children ?? []);
                setAttendance(data.attendance ?? {});
                setLogs(data.logs ?? []);
            } catch (err) {
                if (!cancelled) {
                    console.error(err);
                    setError("Nepodarilo sa načítať dochádzku.");
                    setGroupName(null);
                    setChildrenList([]);
                    setAttendance({});
                    setLogs([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadAttendance();

        return () => {
            cancelled = true;
        };
    }, [dateKey]);

    const handleToggleStatus = async (childId: number) => {
        try {
            const result = await toggleAttendance(dateKey, childId);

            setAttendance((prev) => ({
                ...prev,
                [String(result.attendance.childId)]: result.attendance.state,
            }));

            setLogs((prev) => [result.log, ...prev]);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateMonthlyReport = async () => {
        const monthKey = monthKeyOf(selectedDate);

        try {
            setReportLoading(true);

            await getAttendanceMonthlyReport(monthKey);
            const blob = await downloadAttendanceMonthlyPdf(monthKey);

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `dochadzka_${monthKey}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        } finally {
            setReportLoading(false);
        }
    };

    return (
        <main className="min-h-[100dvh] bg-[#fcf7f3] text-[#3E2E48] flex flex-col pb-12 sm:pb-24">
            <Header />
            
            {/* Zjednotený responzívny kontajner rovnako ako na Nástenke */}
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
                <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/70 shadow-[0_20px_60px_rgba(62,46,72,0.08)] backdrop-blur-xl">
                    <AttendanceHeader
                        title="Denná dochádzka"
                        onCreateReport={handleCreateMonthlyReport}
                        reportLoading={reportLoading}
                        disabled={!childrenList.length}
                        isLoading={loading}
                    />

                    {error ? (
                        <div className="px-6 py-8 text-[#b15252] sm:px-8">{error}</div>
                    ) : !childrenList.length && !loading ? (
                        <div className="px-6 py-8 sm:px-8">
                            Nemáte priradenú žiadnu triedu alebo deti.
                        </div>
                    ) : (
                        <>
                            <AttendanceToolbar
                                groupName={groupName}
                                presentCount={counts.present}
                                absentCount={counts.absent}
                                sickCount={counts.sick}
                                dayLabel={dayLabel}
                                onPrevDay={() => changeDay(-1)}
                                onNextDay={() => changeDay(1)}
                                isLoading={loading}
                            />

                            <AttendanceGrid
                                childrenList={childrenList}
                                attendance={attendance}
                                onToggleStatus={handleToggleStatus}
                                isLoading={loading}
                            />

                            <AttendanceHistoryTable
                                logs={logs}
                                dateLabel={dateKey}
                                isLoading={loading}
                            />
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}