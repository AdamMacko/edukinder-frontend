type CourseKey = "snack_am" | "lunch" | "snack_pm" | "full_day";
type Meals = Record<CourseKey, boolean>;

type CalendarGridProps = {
    weeks: { date: Date; outside: boolean }[][];
    weekdays: string[];
    activeChildId: string;
    activeChildName?: string;
    data: Record<string, Record<string, Meals>>;
    monthLabel: string;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onOpenDay: (date: Date) => void;
    selectedWeekIndex: number;
    onPrevWeek: () => void;
    onNextWeek: () => void;
};

const pad = (n: number) => String(n).padStart(2, "0");
const keyOf = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const allTrue = (): Meals => ({
    snack_am: true,
    lunch: true,
    snack_pm: true,
    full_day: true,
});

const isToday = (d: Date) => {
    const t = new Date();
    return (
        t.getFullYear() === d.getFullYear() &&
        t.getMonth() === d.getMonth() &&
        t.getDate() === d.getDate()
    );
};

function dayLevel(meals: Meals) {
    const count =
        Number(meals.snack_am) + Number(meals.lunch) + Number(meals.snack_pm);

    if (count === 0) return "NONE";
    if (count === 3) return "ALL";
    return "SOME";
}

export function CalendarGrid({
                                 weeks,
                                 weekdays,
                                 activeChildId,
                                 activeChildName,
                                 data,
                                 monthLabel,
                                 onPrevMonth,
                                 onNextMonth,
                                 onOpenDay,
                                 selectedWeekIndex,
                                 onPrevWeek,
                                 onNextWeek,
                             }: CalendarGridProps) {
    const mobileWeek = weeks[selectedWeekIndex] ?? [];
    const desktopDays = weeks.flat();

    return (
        <div className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onPrevMonth}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#3E2E48]/10 bg-white text-lg shadow-sm transition hover:bg-[#faf7f4]"
                    >
                        ‹
                    </button>
                    <div className="rounded-2xl bg-[#f8f5f2] px-4 py-2 text-sm font-bold shadow-inner sm:text-base">
                        {monthLabel}
                    </div>
                    <button
                        onClick={onNextMonth}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#3E2E48]/10 bg-white text-lg shadow-sm transition hover:bg-[#faf7f4]"
                    >
                        ›
                    </button>
                </div>

                <div className="rounded-2xl border border-[#d0a91a]/20 bg-[#fffaf0] px-4 py-2 text-sm font-medium text-[#8c6c00]">
                    Zobrazený kalendár: {activeChildName}
                </div>
            </div>

            {/* MOBILE WEEK NAV */}
            <div className="mb-4 flex items-center justify-between md:hidden">
                <button
                    onClick={onPrevWeek}
                    disabled={selectedWeekIndex === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#3E2E48]/10 bg-white text-base shadow-sm transition hover:bg-[#faf7f4] disabled:opacity-40"
                >
                    ‹
                </button>

                <div className="rounded-2xl bg-[#f8f5f2] px-4 py-2 text-xs font-bold text-[#3E2E48]/70 shadow-inner">
                    Týždeň {selectedWeekIndex + 1} z {weeks.length}
                </div>

                <button
                    onClick={onNextWeek}
                    disabled={selectedWeekIndex >= weeks.length - 1}
                    className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#3E2E48]/10 bg-white text-base shadow-sm transition hover:bg-[#faf7f4] disabled:opacity-40"
                >
                    ›
                </button>
            </div>

            {/* DESKTOP WEEKDAY HEADER */}
            <div className="hidden grid-cols-5 gap-3 md:grid">
                {weekdays.map((day) => (
                    <div
                        key={day}
                        className="px-2 pb-2 text-center text-sm font-bold uppercase tracking-wide text-[#3E2E48]/45"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* MOBILE ONE WEEK */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
                {mobileWeek.map((cell, idx) => {
                    const { date, outside } = cell;
                    const k = keyOf(date);
                    const meals = data[activeChildId]?.[k] ?? allTrue();
                    const level = dayLevel(meals);

                    const statusLabel =
                        level === "NONE"
                            ? "Odhlásený"
                            : level === "ALL"
                                ? "Prihlásený"
                                : "Čiastočne";

                    const classes = [
                        "group min-h-[88px] rounded-[24px] border p-3 text-left transition-all duration-200",
                        outside ? "opacity-65" : "",
                        level === "ALL" ? "border-[#bfd3ff] bg-[#eaf1ff] hover:bg-[#dfe9ff]" : "",
                        level === "SOME" ? "border-[#ecd9a0] bg-[#f9efcf] hover:bg-[#f7e7b7]" : "",
                        level === "NONE" ? "border-[#f0caca] bg-[#fbe7e7] hover:bg-[#f8dddd]" : "",
                        isToday(date) ? "ring-2 ring-[#d0a91a]/40" : "",
                    ]
                        .filter(Boolean)
                        .join(" ");

                    return (
                        <button
                            key={`${k}-${idx}`}
                            onClick={() => onOpenDay(date)}
                            className={classes}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-lg font-extrabold text-[#4b63c9]">
                                        {date.getDate()}
                                    </div>
                                    <div className="mt-1 text-xs font-semibold text-[#3E2E48]/45">
                                        {weekdays[(date.getDay() + 6) % 7]}
                                    </div>
                                </div>

                                <div className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-bold text-[#3E2E48]/65 shadow-sm">
                                    {statusLabel}
                                </div>
                            </div>

                            <div className="mt-4 flex items-end justify-end">
                <span className="text-[11px] font-semibold text-[#3E2E48]/45 transition group-hover:text-[#3E2E48]/70">
                  Upraviť
                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* DESKTOP MONTH GRID */}
            <div className="hidden gap-3 md:grid md:grid-cols-5">
                {desktopDays.map((cell, idx) => {
                    if (!cell) return <div key={idx} />;

                    const { date, outside } = cell;
                    const k = keyOf(date);
                    const meals = data[activeChildId]?.[k] ?? allTrue();
                    const level = dayLevel(meals);

                    const statusLabel =
                        level === "NONE"
                            ? "Odhlásený"
                            : level === "ALL"
                                ? "Prihlásený"
                                : "Čiastočne";

                    const classes = [
                        "group min-h-[108px] rounded-[24px] border p-4 text-left transition-all duration-200",
                        outside ? "opacity-65" : "",
                        level === "ALL" ? "border-[#bfd3ff] bg-[#eaf1ff] hover:bg-[#dfe9ff]" : "",
                        level === "SOME" ? "border-[#ecd9a0] bg-[#f9efcf] hover:bg-[#f7e7b7]" : "",
                        level === "NONE" ? "border-[#f0caca] bg-[#fbe7e7] hover:bg-[#f8dddd]" : "",
                        isToday(date) ? "ring-2 ring-[#d0a91a]/40" : "",
                    ]
                        .filter(Boolean)
                        .join(" ");

                    return (
                        <button
                            key={`${k}-${idx}`}
                            onClick={() => onOpenDay(date)}
                            className={classes}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-xl font-extrabold text-[#4b63c9]">
                                        {date.getDate()}
                                    </div>
                                </div>

                                <div className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-bold text-[#3E2E48]/65 shadow-sm">
                                    {statusLabel}
                                </div>
                            </div>

                            <div className="mt-6 flex items-end justify-end">
                <span className="text-xs font-semibold text-[#3E2E48]/45 transition group-hover:text-[#3E2E48]/70">
                  Upraviť
                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}