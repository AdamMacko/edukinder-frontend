import { SmoothTransition } from "@/app/components/SmoothTransition";

type AttendanceToolbarProps = {
    groupName: string | null;
    presentCount: number;
    absentCount: number;
    sickCount: number;
    dayLabel: string;
    onPrevDay: () => void;
    onNextDay: () => void;
    isLoading?: boolean; // Pridaný prop pre stav načítavania
};

function SummaryCard({
                         label,
                         value,
                     }: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-[24px] border border-[#3E2E48]/8 bg-[#faf7f4] px-4 py-4">
            <div className="text-sm font-semibold text-[#3E2E48]/55">{label}</div>
            <div className="mt-1 text-2xl font-black text-[#3E2E48]">{value}</div>
        </div>
    );
}

export function AttendanceToolbar({
                                      groupName,
                                      presentCount,
                                      absentCount,
                                      sickCount,
                                      dayLabel,
                                      onPrevDay,
                                      onNextDay,
                                      isLoading = false, // Prijímame isLoading s predvolenou hodnotou
                                  }: AttendanceToolbarProps) {
    return (
        <>
            <div className="border-b border-[#3E2E48]/8 bg-white px-6 py-4 sm:px-8">
                <div className="flex flex-wrap items-center justify-end gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf1ff] px-3 py-2 text-[#5673d8]">
            <span className="h-2 w-2 rounded-full bg-[#7fa1ff]" />
            Prítomný
          </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#fbe7e7] px-3 py-2 text-[#bb6b6b]">
            <span className="h-2 w-2 rounded-full bg-[#e79f9f]" />
            Neprítomný
          </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#f9efcf] px-3 py-2 text-[#aa8530]">
            <span className="h-2 w-2 rounded-full bg-[#e2c26a]" />
            Chorý
          </span>
                </div>

                {/* Štatistiky obalené v SmoothTransition */}
                <SmoothTransition 
                    isLoading={isLoading} 
                    className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4"
                >
                    <SummaryCard label="Trieda" value={groupName ?? "-"} />
                    <SummaryCard label="Prítomní" value={String(presentCount)} />
                    <SummaryCard label="Neprítomní" value={String(absentCount)} />
                    <SummaryCard label="Chorí" value={String(sickCount)} />
                </SmoothTransition>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-8">
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onPrevDay}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#3E2E48]/10 bg-white text-lg shadow-sm transition hover:bg-[#faf7f4]"
                        >
                            ‹
                        </button>
                        <div className="rounded-2xl bg-[#f8f5f2] px-4 py-2 font-bold shadow-inner">
                            {dayLabel}
                        </div>
                        <button
                            onClick={onNextDay}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#3E2E48]/10 bg-white text-lg shadow-sm transition hover:bg-[#faf7f4]"
                        >
                            ›
                        </button>
                    </div>

                    <div className="rounded-2xl border border-[#d0a91a]/20 bg-[#fffaf0] px-4 py-2 text-sm font-medium text-[#8c6c00]">
                        Kliknutím na kartu meníte stav dieťaťa
                    </div>
                </div>
            </div>
        </>
    );
}