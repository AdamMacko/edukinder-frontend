"use client";

import { TeacherMealStatementItem } from "@/lib/api/teacher-meals";

type ClassPaymentsSectionProps = {
    className: string | null;
    monthLabel: string;
    items: TeacherMealStatementItem[];
    loading: boolean;
    error: string | null;
    onMarkPaid: (item: TeacherMealStatementItem) => Promise<void>;
    submittingId: number | null;
};

const formatMoney = (n: number) =>
    `${n.toLocaleString("sk-SK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}€`;

function statusLabel(status: TeacherMealStatementItem["status"]) {
    switch (status) {
        case "UNPAID":
            return "Neuhradené";
        case "PARTIAL":
            return "Čiastočne uhradené";
        case "PAID":
            return "Uhradené";
        default:
            return status;
    }
}

function statusClasses(status: TeacherMealStatementItem["status"]) {
    switch (status) {
        case "UNPAID":
            return "bg-[#fbe7e7] text-[#bb6b6b]";
        case "PARTIAL":
            return "bg-[#f9efcf] text-[#aa8530]";
        case "PAID":
            return "bg-[#e8f6e8] text-[#4d8a57]";
        default:
            return "bg-[#f3f3f3] text-[#666]";
    }
}

export function ClassPaymentsSection({
                                         className,
                                         monthLabel,
                                         items,
                                         loading,
                                         error,
                                         onMarkPaid,
                                         submittingId,
                                     }: ClassPaymentsSectionProps) {
    if (error) {
        return <div className="px-6 py-8 text-[#b15252] sm:px-8">{error}</div>;
    }

    if (loading) {
        return <div className="px-6 py-8 sm:px-8">Načítavam...</div>;
    }

    if (!items.length) {
        return (
            <div className="px-6 py-8 sm:px-8">
                Pre zvolený mesiac nie sú dostupné žiadne predpisy triedy.
            </div>
        );
    }

    return (
        <div className="px-6 pb-6 sm:px-8">
            <div className="mb-5 rounded-[24px] border border-[#d0a91a]/20 bg-[#fffaf0] px-4 py-4 text-sm text-[#8c6c00]">
                <div className="font-bold">Trieda: {className ?? "-"}</div>
                <div className="mt-1">Obdobie: {monthLabel}</div>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-[#3E2E48]/8 bg-[#fcfaf8]">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-[#f4efea] text-left">
                        <tr className="text-[#3E2E48]/70">
                            <th className="px-4 py-3 font-bold">Dieťa</th>
                            <th className="px-4 py-3 font-bold text-right">Plán dní</th>
                            <th className="px-4 py-3 font-bold text-right">Na úhradu</th>
                            <th className="px-4 py-3 font-bold">Status</th>
                            <th className="px-4 py-3 font-bold">Potvrdenie</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((item) => (
                            <tr key={item.statementId} className="border-t border-[#3E2E48]/8">
                                <td className="px-4 py-3 font-semibold text-[#3E2E48]">
                                    {item.childName}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {item.plannedDays}
                                </td>
                                <td className="px-4 py-3 text-right font-semibold">
                                    {formatMoney(item.totalToPay)}
                                </td>
                                <td className="px-4 py-3">
                  <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                          item.status
                      )}`}
                  >
                    {statusLabel(item.status)}
                  </span>
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        type="button"
                                        disabled={item.status === "PAID" || submittingId === item.statementId}
                                        onClick={() => void onMarkPaid(item)}
                                        className="rounded-xl border border-[#3E2E48]/10 bg-white px-3 py-2 text-sm font-semibold transition hover:bg-[#f8f5f2] disabled:opacity-50"
                                    >
                                        {item.status === "PAID"
                                            ? "Uhradené"
                                            : submittingId === item.statementId
                                                ? "Ukladám..."
                                                : "Označiť ako uhradené"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}