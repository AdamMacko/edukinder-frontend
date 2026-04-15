"use client";

import { Header } from "@/app/components/Header";
import { useEffect, useMemo, useState } from "react";
import { MealsSubnav } from "@/app/components/meals/MealsSubnav";
import { MealsHeader } from "@/app/components/meals/MealsHeader";
import { ChildTabs } from "@/app/components/meals/ChildTabs";
import { CalendarGrid } from "@/app/components/meals/CalendarGrid";
import { EditMealsModal } from "@/app/components/meals/EditMealsModal";
import { PaymentsTabs } from "@/app/components/meals/PaymentsTabs";
import { StatementsSection } from "@/app/components/meals/StatementsSection";
import { PaymentsHistorySection } from "@/app/components/meals/PaymentsHistorySection";
import { PaymentQrModal } from "@/app/components/meals/PaymentQrModal";
import { CancellationModeSwitch } from "@/app/components/meals/CancellationModeSwitch";
import { RangeCancellationForm } from "@/app/components/meals/RangeCancellationForm";
import { ClassPaymentsSection } from "@/app/components/meals/ClassPaymentsSection";
import {
    getTeacherClassMealStatements,
    markTeacherMealStatementPaid,
    type TeacherMealStatementItem,
} from "@/lib/api/teacher-meals";
import {
    getMealsAttendance,
    getMyChildren,
    saveMealsAttendance,
    type Meals,
    type CourseKey,
} from "@/lib/api/meals";
import {
    getMyMealStatements,
    getMyMealsPayments,
    type MealStatementStatus,
} from "@/lib/api/payments";

type MainTab = "CANCELLATION" | "PAYMENTS" | "OVERVIEW" | "CLASS_PAYMENTS";

type Child = { id: string; name: string; color: string };

type ChildStatements = {
    childId: number;
    childName: string;
    items: {
        id: number;
        month: string;
        plannedDays: number;
        mealsAmount: number;
        carryOverIn: number;
        totalToPay: number;
        carryOverOut: number;
        status: MealStatementStatus;
        qrPayload?: string | null;
        paymentDetails?: {
            recipientName: string;
            iban: string;
            vs: string;
            amount: number;
            note: string;
        };
    }[];
};

type ChildMealsPayments = {
    childId: number;
    childName: string;
    records: {
        id: number;
        paidAt: string;
        amount: number;
    }[];
};

type QrModalState = {
    open: boolean;
    childName: string;
    qrValue: string;
    details?: {
        recipientName: string;
        iban: string;
        vs: string;
        amount: number;
        note: string;
    };
};

const WEEKDAYS = ["Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok"];
const MONTHS_SK = [
    "Január", "Február", "Marec", "Apríl", "Máj", "Jún",
    "Júl", "August", "September", "Október", "November", "December",
];

const pad = (n: number) => String(n).padStart(2, "0");
const keyOf = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function buildWeeks(y: number, m: number) {
    type Cell = { date: Date; outside: boolean };

    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);

    const weeks: (Cell | null)[][] = [];
    let week: (Cell | null)[] = [null, null, null, null, null];

    const firstWeekday = ((first.getDay() + 6) % 7) + 1;

    if (firstWeekday > 1 && firstWeekday <= 6) {
        const d = new Date(first);
        d.setDate(d.getDate() - (firstWeekday - 1));

        for (let wd = 1; wd < firstWeekday; wd++) {
            if (wd <= 5) week[wd - 1] = { date: new Date(d), outside: true };
            d.setDate(d.getDate() + 1);
        }
    }

    for (let day = 1; day <= last.getDate(); day++) {
        const d = new Date(y, m, day);
        const wd = ((d.getDay() + 6) % 7) + 1;

        if (wd >= 6) continue;

        week[wd - 1] = { date: d, outside: false };

        if (wd === 5) {
            weeks.push(week);
            week = [null, null, null, null, null];
        }
    }

    if (week.some(Boolean)) {
        const d = new Date(y, m + 1, 1);

        for (let i = 0; i < 5; i++) {
            if (!week[i]) {
                while (true) {
                    const wd = ((d.getDay() + 6) % 7) + 1;
                    if (wd <= 5) {
                        week[i] = { date: new Date(d), outside: true };
                        d.setDate(d.getDate() + 1);
                        break;
                    }
                    d.setDate(d.getDate() + 1);
                }
            }
        }

        weeks.push(week);
    }

    return weeks as { date: Date; outside: boolean }[][];
}

const allTrue = (): Meals => ({
    snack_am: true,
    lunch: true,
    snack_pm: true,
    full_day: true,
});

const cloneMeals = (m?: Meals): Meals => (m ? { ...m } : allTrue());

function schoolYearLabelFromIso(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Neznámy";
    const y = d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1;
    return `${y}/${y + 1}`;
}

export default function MealsPage() {
    const now = new Date();

    const [activeMainTab, setActiveMainTab] =
        useState<MainTab>("CANCELLATION");


    const [childrenList, setChildrenList] = useState<Child[]>([]);
    const [childrenLoading, setChildrenLoading] = useState(true);
    const [childrenError, setChildrenError] = useState<string | null>(null);

    const [ym, setYM] = useState({ y: now.getFullYear(), m: now.getMonth() });
    const [activeChildId, setActiveChildId] = useState<string | null>(null);

    const [data, setData] = useState<Record<string, Record<string, Meals>>>({});
    const [saveError, setSaveError] = useState<string | null>(null);

    const [dialog, setDialog] = useState<{
        open: boolean;
        date: Date | null;
        edit: Record<string, Meals> | null;
    }>({
        open: false,
        date: null,
        edit: null,
    });

    const [statements, setStatements] = useState<ChildStatements[]>([]);
    const [statementsLoading, setStatementsLoading] = useState(false);
    const [statementsError, setStatementsError] = useState<string | null>(null);

    const [mealsPayments, setMealsPayments] = useState<ChildMealsPayments[]>([]);
    const [paymentsLoading, setPaymentsLoading] = useState(false);
    const [paymentsError, setPaymentsError] = useState<string | null>(null);
    const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
    const [cancellationMode, setCancellationMode] = useState<"calendar" | "range">("calendar");
    const [teacherClassName, setTeacherClassName] = useState<string | null>(null);
    const [teacherMonthItems, setTeacherMonthItems] = useState<TeacherMealStatementItem[]>([]);
    const [teacherLoading, setTeacherLoading] = useState(false);
    const [teacherError, setTeacherError] = useState<string | null>(null);
    const [teacherSubmittingId, setTeacherSubmittingId] = useState<number | null>(null);
    const currentMonthKey = `${ym.y}-${pad(ym.m + 1)}`;
    const currentMonthLabel = `${MONTHS_SK[ym.m]} ${ym.y}`;
    const [qrModal, setQrModal] = useState<QrModalState>({
        open: false,
        childName: "",
        qrValue: "",
        details: undefined,
    });
    function getWorkingDatesInRange(from: string, to: string) {
        const dates: string[] = [];

        const start = new Date(from);
        const end = new Date(to);

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return dates;
        if (start > end) return dates;

        const d = new Date(start);

        while (d <= end) {
            const day = d.getDay();
            if (day !== 0 && day !== 6) {
                dates.push(keyOf(d));
            }
            d.setDate(d.getDate() + 1);
        }

        return dates;
    }

    async function handleRangeCancellation(payload: {
        childId: string;
        from: string;
        to: string;
        scope: "full_day" | "lunch";
    }) {
        const workingDates = getWorkingDatesInRange(payload.from, payload.to);

        if (!workingDates.length) return;

        const childId = payload.childId;

        for (const dateKey of workingDates) {
            const current = data[childId]?.[dateKey] ?? allTrue();

            let nextMeals: Meals;

            if (payload.scope === "full_day") {
                nextMeals = {
                    snack_am: false,
                    lunch: false,
                    snack_pm: false,
                    full_day: false,
                };
            } else {
                const snack_am = current.snack_am;
                const snack_pm = current.snack_pm;
                const lunch = false;

                nextMeals = {
                    snack_am,
                    lunch,
                    snack_pm,
                    full_day: snack_am && lunch && snack_pm,
                };
            }

            setData((prev) => {
                const out = { ...prev };
                if (!out[childId]) out[childId] = {};
                out[childId] = {
                    ...out[childId],
                    [dateKey]: nextMeals,
                };
                return out;
            });

            await saveMealsAttendance({
                date: dateKey,
                entries: [
                    {
                        childId: Number(childId),
                        meals: {
                            snack_am: nextMeals.snack_am,
                            lunch: nextMeals.lunch,
                            snack_pm: nextMeals.snack_pm,
                        },
                    },
                ],
            });
        }
    }

    const [syIndex, setSyIndex] = useState(0);
    const weeks = useMemo(() => buildWeeks(ym.y, ym.m), [ym]);

    useEffect(() => {
        if (activeMainTab !== "CLASS_PAYMENTS") return;

        let alive = true;

        (async () => {
            try {
                setTeacherLoading(true);
                setTeacherError(null);

                const result = await getTeacherClassMealStatements(currentMonthKey);

                if (!alive) return;

                setTeacherClassName(result.className);
                setTeacherMonthItems(result.items);
            } catch (err) {
                console.error(err);
                if (!alive) return;
                setTeacherError(
                    err instanceof Error
                        ? err.message
                        : "Nepodarilo sa načítať predpisy triedy."
                );
            } finally {
                if (alive) setTeacherLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [activeMainTab, currentMonthKey]);

    useEffect(() => {
        const today = new Date();
        const isCurrentMonth =
            today.getFullYear() === ym.y && today.getMonth() === ym.m;

        if (!weeks.length) {
            setSelectedWeekIndex(0);
            return;
        }

        if (isCurrentMonth) {
            const todayKey = keyOf(today);
            const weekIndex = weeks.findIndex((week) =>
                week.some((cell) => keyOf(cell.date) === todayKey)
            );

            setSelectedWeekIndex(weekIndex >= 0 ? weekIndex : 0);
        } else {
            setSelectedWeekIndex(0);
        }
    }, [ym, weeks]);

    useEffect(() => {
        const loadChildren = async () => {
            try {
                setChildrenLoading(true);
                setChildrenError(null);

                const apiChildren = await getMyChildren();

                const palette = ["bg-[#6c8ef5]", "bg-[#5aa6a6]", "bg-[#d0a91a]", "bg-[#c77dff]"];

                const mapped: Child[] = apiChildren.map((c, index) => ({
                    id: String(c.id),
                    name: `${c.firstName} ${c.lastName}`.trim(),
                    color: palette[index % palette.length],
                }));

                setChildrenList(mapped);
                setActiveChildId(mapped[0]?.id ?? null);
            } catch (err) {
                console.error(err);
                setChildrenError("Nepodarilo sa načítať deti.");
            } finally {
                setChildrenLoading(false);
            }
        };

        loadChildren();
    }, []);

    async function handleTeacherMarkPaid(item: TeacherMealStatementItem) {
        try {
            setTeacherSubmittingId(item.statementId);

            const result = await markTeacherMealStatementPaid({
                childId: item.childId,
                month: currentMonthKey,
            });

            setTeacherMonthItems((prev) =>
                prev.map((row) =>
                    row.statementId === item.statementId
                        ? {
                            ...row,
                            status: result.status,
                            paidAt: result.paidAt,
                        }
                        : row
                )
            );

            if (activeMainTab === "PAYMENTS") {
                const refreshedStatements = await getMyMealStatements();

                const byChild = new Map<number, ChildStatements>();

                for (const s of refreshedStatements) {
                    if (!byChild.has(s.childId)) {
                        byChild.set(s.childId, {
                            childId: s.childId,
                            childName: s.childName,
                            items: [],
                        });
                    }

                    const bucket = byChild.get(s.childId)!;
                    bucket.items.push({
                        id: s.id,
                        month: s.month,
                        plannedDays: s.plannedDays,
                        mealsAmount: Number(s.mealsAmount ?? 0),
                        carryOverIn: Number(s.carryOverIn ?? 0),
                        totalToPay: Number(s.totalToPay ?? 0),
                        carryOverOut: Number(s.carryOverOut ?? 0),
                        status: s.status,
                        qrPayload: s.qrPayload ?? undefined,
                        paymentDetails: s.paymentDetails,
                    });
                }

                setStatements(Array.from(byChild.values()));
            }
        } catch (err) {
            console.error(err);
            setTeacherError(
                err instanceof Error ? err.message : "Nepodarilo sa potvrdiť úhradu."
            );
        } finally {
            setTeacherSubmittingId(null);
        }
    }

    useEffect(() => {
        if (!childrenList.length) return;

        const from = new Date(ym.y, ym.m, 1);
        const to = new Date(ym.y, ym.m + 1, 0);

        const loadAttendance = async () => {
            try {
                const serverData = await getMealsAttendance({
                    from: keyOf(from),
                    to: keyOf(to),
                    childIds: childrenList.map((c) => c.id).join(","),
                });

                const normalized: Record<string, Record<string, Meals>> = {};

                for (const [cid, days] of Object.entries(serverData)) {
                    normalized[cid] = {};

                    for (const [dateKey, m] of Object.entries(days)) {
                        const snack_am = !!m.snack_am;
                        const lunch = !!m.lunch;
                        const snack_pm = !!m.snack_pm;

                        normalized[cid][dateKey] = {
                            snack_am,
                            lunch,
                            snack_pm,
                            full_day: snack_am && lunch && snack_pm,
                        };
                    }
                }

                setData(normalized);
            } catch (err) {
                console.error(err);
            }
        };

        loadAttendance();
    }, [ym, childrenList]);

    useEffect(() => {
        if (activeMainTab !== "PAYMENTS") return;

        let alive = true;

        (async () => {
            try {
                setStatementsLoading(true);
                setStatementsError(null);

                const raw = await getMyMealStatements();

                const byChild = new Map<number, ChildStatements>();

                for (const s of raw) {
                    if (!byChild.has(s.childId)) {
                        byChild.set(s.childId, {
                            childId: s.childId,
                            childName: s.childName,
                            items: [],
                        });
                    }

                    const bucket = byChild.get(s.childId)!;
                    bucket.items.push({
                        id: s.id,
                        month: s.month,
                        plannedDays: s.plannedDays,
                        mealsAmount: Number(s.mealsAmount ?? 0),
                        carryOverIn: Number(s.carryOverIn ?? 0),
                        totalToPay: Number(s.totalToPay ?? 0),
                        carryOverOut: Number(s.carryOverOut ?? 0),
                        status: s.status,
                        qrPayload: s.qrPayload ?? undefined,
                        paymentDetails: s.paymentDetails,
                    });
                }

                for (const child of byChild.values()) {
                    child.items.sort((a, b) => {
                        const da = new Date(a.month).getTime();
                        const db = new Date(b.month).getTime();
                        return db - da;
                    });
                }

                if (alive) setStatements(Array.from(byChild.values()));
            } catch (err: unknown) {
                console.error(err);
                if (alive) {
                    setStatementsError(
                        err instanceof Error
                            ? err.message
                            : "Nepodarilo sa načítať mesačné predpisy za stravu."
                    );
                }
            } finally {
                if (alive) setStatementsLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [activeMainTab]);

    useEffect(() => {
        if (activeMainTab !== "PAYMENTS") return;

        let alive = true;

        (async () => {
            try {
                setPaymentsLoading(true);
                setPaymentsError(null);

                const raw = await getMyMealsPayments();

                const byChild = new Map<number, ChildMealsPayments>();

                for (const p of raw) {
                    if (!byChild.has(p.childId)) {
                        byChild.set(p.childId, {
                            childId: p.childId,
                            childName: p.childName,
                            records: [],
                        });
                    }

                    const bucket = byChild.get(p.childId)!;
                    bucket.records.push({
                        id: p.id,
                        paidAt: p.paidAt,
                        amount: Number(p.amount ?? 0),
                    });
                }

                if (alive) setMealsPayments(Array.from(byChild.values()));
            } catch (err: unknown) {
                console.error(err);
                if (alive) {
                    setPaymentsError(
                        err instanceof Error
                            ? err.message
                            : "Nepodarilo sa načítať platby za stravu."
                    );
                }
            } finally {
                if (alive) setPaymentsLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [activeMainTab]);


    const activeChild = childrenList.find((c) => c.id === activeChildId) ?? null;

    const schoolYears = useMemo(() => {
        const set = new Set<string>();

        for (const child of statements) {
            for (const it of child.items) {
                set.add(schoolYearLabelFromIso(it.month));
            }
        }

        for (const child of mealsPayments) {
            for (const r of child.records) {
                set.add(schoolYearLabelFromIso(r.paidAt));
            }
        }

        return Array.from(set).sort((a, b) => b.localeCompare(a));
    }, [statements, mealsPayments]);

    useEffect(() => {
        if (schoolYears.length > 0) setSyIndex(0);
    }, [schoolYears]);

    const activeSY = schoolYears[syIndex] ?? null;

    const prevMonth = () =>
        setYM((p) => (p.m === 0 ? { y: p.y - 1, m: 11 } : { y: p.y, m: p.m - 1 }));

    const nextMonth = () =>
        setYM((p) => (p.m === 11 ? { y: p.y + 1, m: 0 } : { y: p.y, m: p.m + 1 }));

    const openDialog = (d: Date) => {
        if (!childrenList.length) return;

        const dateKey = keyOf(d);
        const edit: Record<string, Meals> = {};

        for (const c of childrenList) {
            edit[c.id] = cloneMeals(data[c.id]?.[dateKey]);
        }

        setDialog({ open: true, date: d, edit });
    };

    const closeDialog = () =>
        setDialog({ open: false, date: null, edit: null });

    const onToggle = (childId: string, key: CourseKey, value: boolean) => {
        if (!dialog.edit) return;

        const next = { ...dialog.edit };
        const current = { ...next[childId] };

        if (key === "full_day") {
            current.full_day = value;
            current.snack_am = value;
            current.lunch = value;
            current.snack_pm = value;
        } else {
            current[key] = value;
            current.full_day =
                current.snack_am && current.lunch && current.snack_pm;
        }

        next[childId] = current;
        setDialog({ ...dialog, edit: next });
    };

    const saveDialog = async () => {
        if (!dialog.date || !dialog.edit || !childrenList.length) return;

        const dateKey = keyOf(dialog.date);
        setSaveError(null);

        setData((prev) => {
            const out: Record<string, Record<string, Meals>> = { ...prev };

            for (const c of childrenList) {
                const cid = c.id;
                const meals = dialog.edit![cid];

                if (!out[cid]) out[cid] = {};
                out[cid][dateKey] = cloneMeals(meals);
            }

            return out;
        });

        try {
            await saveMealsAttendance({
                date: dateKey,
                entries: childrenList.map((c) => ({
                    childId: Number(c.id),
                    meals: {
                        snack_am: dialog.edit![c.id].snack_am,
                        lunch: dialog.edit![c.id].lunch,
                        snack_pm: dialog.edit![c.id].snack_pm,
                    },
                })),
            });
        } catch (err) {
            console.error(err);
            setSaveError("Nepodarilo sa uložiť zmeny.");
        }

        closeDialog();
    };

    return (
        <>
            <Header />

            <div className="min-h-screen bg-[#fcf7f3] text-[#3E2E48]">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <MealsSubnav active={activeMainTab} onChange={setActiveMainTab} />

                    {activeMainTab === "CANCELLATION" && (
                        <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/70 shadow-[0_20px_60px_rgba(62,46,72,0.08)] backdrop-blur-xl">
                            <MealsHeader title="Odhlasovanie stravy" />

                            {childrenLoading ? (
                                <div className="px-6 py-8 sm:px-8">Načítavam deti…</div>
                            ) : childrenError ? (
                                <div className="px-6 py-8 sm:px-8 text-[#b15252]">
                                    {childrenError}
                                </div>
                            ) : !childrenList.length ? (
                                <div className="px-6 py-8 sm:px-8">
                                    Tomuto účtu zatiaľ nie sú priradené žiadne deti.
                                </div>
                            ) : (
                                <>
                                    <ChildTabs
                                        childrenList={childrenList}
                                        activeChildId={activeChildId ?? ""}
                                        onChange={setActiveChildId}
                                    />

                                    <CancellationModeSwitch
                                        value={cancellationMode}
                                        onChange={setCancellationMode}
                                    />

                                    {cancellationMode === "calendar" ? (
                                        <CalendarGrid
                                            weeks={weeks}
                                            weekdays={WEEKDAYS}
                                            activeChildId={activeChildId ?? ""}
                                            activeChildName={activeChild?.name}
                                            data={data}
                                            monthLabel={`${MONTHS_SK[ym.m]} ${ym.y}`}
                                            onPrevMonth={prevMonth}
                                            onNextMonth={nextMonth}
                                            onOpenDay={openDialog}
                                            selectedWeekIndex={selectedWeekIndex}
                                            onPrevWeek={() =>
                                                setSelectedWeekIndex((prev) => Math.max(prev - 1, 0))
                                            }
                                            onNextWeek={() =>
                                                setSelectedWeekIndex((prev) => Math.min(prev + 1, weeks.length - 1))
                                            }
                                        />
                                    ) : (
                                        <RangeCancellationForm
                                            childrenList={childrenList}
                                            activeChildId={activeChildId ?? ""}
                                            onChildChange={setActiveChildId}
                                            onSubmit={handleRangeCancellation}
                                        />
                                    )}
                                </>
                            )}

                            {saveError && (
                                <div className="px-6 pb-6 text-sm font-medium text-[#b15252] sm:px-8">
                                    {saveError}
                                </div>
                            )}
                        </div>
                    )}

                    {activeMainTab === "PAYMENTS" && (
                        <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/70 shadow-[0_20px_60px_rgba(62,46,72,0.08)] backdrop-blur-xl">
                            <MealsHeader title="Platby za stravu" />

                            {activeSY && (
                                <div className="px-6 pt-6 sm:px-8">
                                    <div className="mb-4 flex justify-end">
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#3E2E48]/10 bg-white text-lg shadow-sm transition hover:bg-[#faf7f4]"
                                                onClick={() => setSyIndex((i) => Math.max(i - 1, 0))}
                                            >
                                                ‹
                                            </button>
                                            <div className="rounded-2xl bg-[#f8f5f2] px-4 py-2 font-bold shadow-inner">
                                                {activeSY}
                                            </div>
                                            <button
                                                type="button"
                                                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#3E2E48]/10 bg-white text-lg shadow-sm transition hover:bg-[#faf7f4]"
                                                onClick={() =>
                                                    setSyIndex((i) => Math.min(i + 1, schoolYears.length - 1))
                                                }
                                            >
                                                ›
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <StatementsSection
                                statements={statements}
                                loading={statementsLoading}
                                error={statementsError}
                                activeSchoolYear={activeSY}
                                onOpenQr={(childName, qrValue, details) =>
                                    setQrModal({
                                        open: true,
                                        childName,
                                        qrValue,
                                        details,
                                    })
                                }
                            />
                        </div>
                    )}

                    {activeMainTab === "OVERVIEW" && (
                        <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/70 shadow-[0_20px_60px_rgba(62,46,72,0.08)] backdrop-blur-xl">
                            <MealsHeader title="Prehľad platieb" />

                            {activeSY && (
                                <div className="px-6 pt-6 sm:px-8">
                                    <div className="mb-4 flex justify-end">
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#3E2E48]/10 bg-white text-lg shadow-sm transition hover:bg-[#faf7f4]"
                                                onClick={() => setSyIndex((i) => Math.max(i - 1, 0))}
                                            >
                                                ‹
                                            </button>
                                            <div className="rounded-2xl bg-[#f8f5f2] px-4 py-2 font-bold shadow-inner">
                                                {activeSY}
                                            </div>
                                            <button
                                                type="button"
                                                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#3E2E48]/10 bg-white text-lg shadow-sm transition hover:bg-[#faf7f4]"
                                                onClick={() =>
                                                    setSyIndex((i) => Math.min(i + 1, schoolYears.length - 1))
                                                }
                                            >
                                                ›
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <PaymentsHistorySection
                                payments={mealsPayments}
                                loading={paymentsLoading}
                                error={paymentsError}
                                activeSchoolYear={activeSY}
                            />
                        </div>
                    )}

                    {activeMainTab === "CLASS_PAYMENTS" && (
                        <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/70 shadow-[0_20px_60px_rgba(62,46,72,0.08)] backdrop-blur-xl">
                            <MealsHeader title="Úhrady triedy" />

                            <div className="px-6 pt-6 sm:px-8">
                                <div className="mb-4 flex justify-end">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#3E2E48]/10 bg-white text-lg shadow-sm transition hover:bg-[#faf7f4]"
                                            onClick={prevMonth}
                                        >
                                            ‹
                                        </button>
                                        <div className="rounded-2xl bg-[#f8f5f2] px-4 py-2 font-bold shadow-inner">
                                            {currentMonthLabel}
                                        </div>
                                        <button
                                            type="button"
                                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#3E2E48]/10 bg-white text-lg shadow-sm transition hover:bg-[#faf7f4]"
                                            onClick={nextMonth}
                                        >
                                            ›
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <ClassPaymentsSection
                                className={teacherClassName}
                                monthLabel={currentMonthLabel}
                                items={teacherMonthItems}
                                loading={teacherLoading}
                                error={teacherError}
                                onMarkPaid={handleTeacherMarkPaid}
                                submittingId={teacherSubmittingId}
                            />
                        </div>
                    )}

                </div>

                <EditMealsModal
                    isOpen={dialog.open}
                    date={dialog.date}
                    edit={dialog.edit}
                    childrenList={childrenList}
                    monthNames={MONTHS_SK}
                    weekdays={WEEKDAYS}
                    onClose={closeDialog}
                    onSave={saveDialog}
                    onToggle={onToggle}
                />

                <PaymentQrModal
                    open={qrModal.open}
                    childName={qrModal.childName}
                    qrValue={qrModal.qrValue}
                    details={qrModal.details}
                    onClose={() =>
                        setQrModal({
                            open: false,
                            childName: "",
                            qrValue: "",
                            details: undefined,
                        })
                    }
                />
            </div>
        </>
    );
}