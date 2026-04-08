import { AttendanceLog, AttendanceState } from "@/app/types/attendance";
import { SmoothTransition } from "@/app/components/SmoothTransition";

type AttendanceHistoryTableProps = {
    logs: AttendanceLog[];
    dateLabel: string;
    isLoading?: boolean; // Pridaný prop pre stav načítavania
};

const pad = (n: number) => String(n).padStart(2, "0");

function formatTime(iso: string) {
    const date = new Date(iso);
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
    )}`;
}

function getStatusLabel(status: AttendanceState) {
    switch (status) {
        case "PRESENT":
            return "Prítomný";
        case "ABSENT":
            return "Neprítomný";
        case "SICK":
            return "Chorý";
    }
}

export function AttendanceHistoryTable({
                                           logs,
                                           dateLabel,
                                           isLoading = false, // Prijímame isLoading s predvolenou hodnotou
                                       }: AttendanceHistoryTableProps) {
    return (
        <div className="border-t border-[#3E2E48]/8 bg-white px-6 py-6 sm:px-8">
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight">História zmien</h2>
                    <p className="mt-1 text-sm text-[#3E2E48]/60">
                        Prehľad posledných úprav pre zvolený deň.
                    </p>
                </div>

                <div className="rounded-2xl bg-[#f8f5f2] px-4 py-2 text-sm font-semibold text-[#3E2E48]/70">
                    {dateLabel}
                </div>
            </div>

            {/* Obalili sme celú oblasť s tabuľkou (alebo empty state-om) do SmoothTransition */}
            <SmoothTransition 
                isLoading={isLoading} 
                className="overflow-hidden rounded-[24px] border border-[#3E2E48]/8 bg-[#fcfaf8]"
            >
                <div className="overflow-x-auto">
                    {logs.length === 0 ? (
                        <div className="px-4 py-4 text-sm text-[#3E2E48]/70">
                            Zatiaľ neboli vykonané žiadne zmeny pre tento deň.
                        </div>
                    ) : (
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#f4efea] text-left">
                            <tr className="text-[#3E2E48]/70">
                                <th className="px-4 py-3 font-bold">Čas zmeny</th>
                                <th className="px-4 py-3 font-bold">Dieťa</th>
                                <th className="px-4 py-3 font-bold">Zmena</th>
                                <th className="px-4 py-3 font-bold">Používateľ</th>
                            </tr>
                            </thead>
                            <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="border-t border-[#3E2E48]/8">
                                    <td className="px-4 py-3 text-[#3E2E48]/70">
                                        {formatTime(log.timestamp)}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-[#3E2E48]">
                                        {log.childName}
                                    </td>
                                    <td className="px-4 py-3 text-[#3E2E48]/80">
                                        {getStatusLabel(log.from)} → {getStatusLabel(log.to)}
                                    </td>
                                    <td className="px-4 py-3 text-[#3E2E48]/70">
                                        {log.userEmail}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </SmoothTransition>
        </div>
    );
}