import { MealStatementStatus } from "@/lib/api/payments";

type StatementItem = {
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
};

type ChildStatements = {
    childId: number;
    childName: string;
    items: StatementItem[];
};

type StatementsSectionProps = {
    statements: ChildStatements[];
    loading: boolean;
    error: string | null;
    activeSchoolYear: string | null;
    onOpenQr: (
        childName: string,
        qrValue: string,
        details?: StatementItem["paymentDetails"]
    ) => void;
};

const SK_MONTHS = [
    "Január", "Február", "Marec", "Apríl", "Máj", "Jún",
    "Júl", "August", "September", "Október", "November", "December",
];

const formatMonth = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return `${SK_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const formatMoney = (n: number) =>
    `${n.toLocaleString("sk-SK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}€`;

function schoolYearLabelFromIso(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Neznámy";
    const y = d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1;
    return `${y}/${y + 1}`;
}

function statusLabel(status: MealStatementStatus): string {
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

function statusClasses(status: MealStatementStatus) {
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

export function StatementsSection({
                                      statements,
                                      loading,
                                      error,
                                      activeSchoolYear,
                                      onOpenQr,
                                  }: StatementsSectionProps) {
    if (error) {
        return <div className="px-6 py-8 text-[#b15252] sm:px-8">{error}</div>;
    }

    if (loading) {
        return <div className="px-6 py-8 sm:px-8">Načítavam...</div>;
    }

    if (!statements.length) {
        return (
            <div className="px-6 py-8 sm:px-8">
                Zatiaľ neevidujeme žiadne predpisy za stravu.
            </div>
        );
    }

    return (
        <div className="space-y-6 px-6 pb-6 sm:px-8">
            {statements.map((child) => (
                <section key={child.childId}>
                    <h2 className="mb-4 text-2xl font-black tracking-tight">
                        {child.childName}
                    </h2>

                    <div className="overflow-hidden rounded-[24px] border border-[#3E2E48]/8 bg-[#fcfaf8]">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-[#f4efea] text-left">
                                <tr className="text-[#3E2E48]/70">
                                    <th className="px-4 py-3 font-bold">Mesiac</th>
                                    <th className="px-4 py-3 font-bold text-right">Suma</th>
                                    <th className="px-4 py-3 font-bold text-right">
                                        Preplatok z minulého mesiaca
                                    </th>
                                    <th className="px-4 py-3 font-bold text-right">Na úhradu</th>
                                    <th className="px-4 py-3 font-bold">Status</th>
                                    <th className="px-4 py-3 font-bold">Platobné údaje</th>
                                </tr>
                                </thead>
                                <tbody>
                                {child.items
                                    .filter(
                                        (item) =>
                                            !activeSchoolYear ||
                                            schoolYearLabelFromIso(item.month) === activeSchoolYear
                                    )
                                    .map((item) => (
                                        <tr key={item.id} className="border-t border-[#3E2E48]/8">
                                            <td className="px-4 py-3 font-semibold text-[#3E2E48]">
                                                {formatMonth(item.month)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {formatMoney(item.mealsAmount)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {formatMoney(item.carryOverIn)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
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
                                                    className="rounded-xl border border-[#3E2E48]/10 bg-white px-3 py-2 text-sm font-semibold transition hover:bg-[#f8f5f2]"
                                                    onClick={() =>
                                                        item.qrPayload &&
                                                        onOpenQr(child.childName, item.qrPayload, item.paymentDetails)
                                                    }
                                                >
                                                    Platobné údaje
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
}