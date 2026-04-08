"use client";

import { Header } from '../components/Header';
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MealsHeader } from "../components/meals/MealsHeader";
import { ChildTabs } from "../components/meals/ChildTabs";
import { CalendarGrid } from "../components/meals/CalendarGrid";
import { EditMealsModal } from "../components/meals/EditMealsModal";

type CourseKey = "snack_am" | "lunch" | "snack_pm" | "full_day";
type Meals = Record<CourseKey, boolean>;
type Child = { id: string; name: string; color: string };


const MY_CHILDREN_URL = "/api/child/mine";

const WEEKDAYS = ["Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok"];
const MONTHS_SK = [
    "Január", "Február", "Marec", "Apríl", "Máj", "Jún",
    "Júl", "August", "September", "Október", "November", "December"
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

export default function LunchCheckoutPage() {
    const now = new Date();

    const [childrenList, setChildrenList] = useState<Child[]>([]);
    const [childrenLoading, setChildrenLoading] = useState(true);
    const [childrenError, setChildrenError] = useState<string | null>(null);

    const [ym, setYM] = useState({ y: now.getFullYear(), m: now.getMonth() });
    const [activeChildId, setActiveChildId] = useState<string | null>(null);

    const [data, setData] = useState<Record<string, Record<string, Meals>>>({});

    const [dialog, setDialog] = useState<{
        open: boolean;
        date: Date | null;
        edit: Record<string, Meals> | null;
    }>({
        open: false,
        date: null,
        edit: null,
    });

    useEffect(() => {
        const loadChildren = async () => {
            try {
                setChildrenLoading(true);
                setChildrenError(null);

                const res = await fetch(MY_CHILDREN_URL, {
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const json = await res.json();

                if (!json.success) {
                    throw new Error(json.error || "Nepodarilo sa načítať deti");
                }

                const apiChildren = json.data as {
                    id: number;
                    firstName: string;
                    lastName: string;
                }[];

                const palette = ["bg-[#6c8ef5]", "bg-[#5aa6a6]", "bg-[#d0a91a]", "bg-[#c77dff]"];

                const mapped: Child[] = apiChildren.map((c, index) => ({
                    id: String(c.id),
                    name: `${c.firstName} ${c.lastName}`.trim(),
                    color: palette[index % palette.length],
                }));

                setChildrenList(mapped);
                setActiveChildId(mapped[0]?.id ?? null);
            } catch (err) {
                console.error("Failed to load children", err);
                setChildrenError("Nepodarilo sa načítať deti.");
            } finally {
                setChildrenLoading(false);
            }
        };

        loadChildren();
    }, []);

    useEffect(() => {
        if (!childrenList.length) return;

        const from = new Date(ym.y, ym.m, 1);
        const to = new Date(ym.y, ym.m + 1, 0);

        const fromKey = keyOf(from);
        const toKey = keyOf(to);
        const childIds = childrenList.map((c) => c.id).join(",");

        const url = `/api/meals/attendance?from=${fromKey}&to=${toKey}&childIds=${encodeURIComponent(childIds)}`;


        const loadAttendance = async () => {
            try {
                const res = await fetch(url, {
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const json = await res.json();

                if (!json.success) {
                    throw new Error(json.error || "Nepodarilo sa načítať dochádzku");
                }

                const serverData = json.data as Record<string, Record<string, Meals>>;

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
                console.error("Failed to load attendance", err);
            }
        };

        loadAttendance();
    }, [ym, childrenList]);

    const weeks = useMemo(() => buildWeeks(ym.y, ym.m), [ym]);
    const activeChild = childrenList.find((c) => c.id === activeChildId) ?? null;

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
            const body = {
                date: dateKey,
                entries: childrenList.map((c) => ({
                    childId: Number(c.id),
                    meals: {
                        snack_am: dialog.edit![c.id].snack_am,
                        lunch: dialog.edit![c.id].lunch,
                        snack_pm: dialog.edit![c.id].snack_pm,
                    },
                })),
            };

            await fetch("/api/meals/attendance", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
        } catch (err) {
            console.error("Failed to save attendance", err);
        }

        closeDialog();
    };

    return (
        <>

            <Header />
            <div className="min-h-screen bg-[#fcf7f3] text-[#3E2E48]">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
                                />
                            </>
                        )}
                    </div>
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
            </div>
        </>
    );
}