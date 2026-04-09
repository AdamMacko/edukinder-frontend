type ChildMealsPayments = {
    childId: number;
    childName: string;
    records: {
        id: number;
        paidAt: string;
        amount: number;
    }[];
};

type PaymentsHistorySectionProps = {
    payments: ChildMealsPayments[];
    loading: boolean;
    error: string | null;
    activeSchoolYear: string | null;
};

const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("sk-SK", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(iso));

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

export function PaymentsHistorySection({
                                           payments,
                                           loading,
                                           error,
                                           activeSchoolYear,
                                       }: PaymentsHistorySectionProps) {
    if (error) {
        return <div className="px-6 py-8 text-[#b15252] sm:px-8">{error}</div>;
    }

    if (loading) {
        return <div className="px-6 py-8 sm:px-8">Načítavam...</div>;
    }

    if (!payments.length) {
        return (
            <div className="px-6 py-8 sm:px-8">
                Zatiaľ neevidujeme žiadne platby za stravu.
            </div>
        );
    }

    return (
        <div className="space-y-6 px-6 pb-6 sm:px-8">
            {payments.map((child) => (
                <section key={child.childId}>
                    <h2 className="mb-4 text-2xl font-black tracking-tight">
                        {child.childName}
                    </h2>

                    <div className="overflow-hidden rounded-[24px] border border-[#3E2E48]/8 bg-[#fcfaf8]">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-[#f4efea] text-left">
                                <tr className="text-[#3E2E48]/70">
                                    <th className="px-4 py-3 font-bold">Dátum platby</th>
                                    <th className="px-4 py-3 font-bold text-right">Suma</th>
                                </tr>
                                </thead>
                                <tbody>
                                {child.records
                                    .filter(
                                        (r) =>
                                            !activeSchoolYear ||
                                            schoolYearLabelFromIso(r.paidAt) === activeSchoolYear
                                    )
                                    .map((r) => (
                                        <tr key={r.id} className="border-t border-[#3E2E48]/8">
                                            <td className="px-4 py-3">{formatDate(r.paidAt)}</td>
                                            <td className="px-4 py-3 text-right">
                                                {formatMoney(r.amount)}
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