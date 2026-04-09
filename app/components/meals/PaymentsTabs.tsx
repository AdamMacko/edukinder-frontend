type Tab = "ORDERS" | "PAYMENTS";

type PaymentsTabsProps = {
    activeTab: Tab;
    onChange: (tab: Tab) => void;
};

export function PaymentsTabs({
                                 activeTab,
                                 onChange,
                             }: PaymentsTabsProps) {
    const tabBase =
        "rounded-full px-4 py-2 text-sm font-semibold transition border";
    const active =
        "bg-[#3E2E48] text-white border-[#3E2E48] shadow-md";
    const inactive =
        "bg-white text-[#3E2E48] border-[#3E2E48]/10 hover:bg-[#f8f5f2]";

    return (
        <div className="mb-4 flex flex-wrap gap-2">
            <button
                type="button"
                onClick={() => onChange("ORDERS")}
                className={`${tabBase} ${activeTab === "ORDERS" ? active : inactive}`}
            >
                Platobné predpisy
            </button>
            <button
                type="button"
                onClick={() => onChange("PAYMENTS")}
                className={`${tabBase} ${activeTab === "PAYMENTS" ? active : inactive}`}
            >
                Platby
            </button>
        </div>
    );
}