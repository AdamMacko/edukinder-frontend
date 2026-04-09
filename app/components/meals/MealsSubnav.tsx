"use client";

type MealsMainTab = "CANCELLATION" | "PAYMENTS" | "OVERVIEW";

type MealsSubnavProps = {
    active: MealsMainTab;
    onChange: (tab: MealsMainTab) => void;
};

export function MealsSubnav({ active, onChange }: MealsSubnavProps) {
    const baseItem =
        "rounded-full px-4 py-2 text-sm font-semibold transition border";
    const activeItem =
        "bg-[#3E2E48] text-white border-[#3E2E48] shadow-md";
    const inactiveItem =
        "bg-white text-[#3E2E48] border-[#3E2E48]/10 hover:bg-[#f8f5f2]";

    return (
        <div className="mb-6 flex flex-wrap gap-2">
            <button
                type="button"
                onClick={() => onChange("CANCELLATION")}
                className={`${baseItem} ${
                    active === "CANCELLATION" ? activeItem : inactiveItem
                }`}
            >
                Odhlasovanie
            </button>

            <button
                type="button"
                onClick={() => onChange("PAYMENTS")}
                className={`${baseItem} ${
                    active === "PAYMENTS" ? activeItem : inactiveItem
                }`}
            >
                Platby
            </button>

            <button
                type="button"
                onClick={() => onChange("OVERVIEW")}
                className={`${baseItem} ${
                    active === "OVERVIEW" ? activeItem : inactiveItem
                }`}
            >
                Prehľad platieb
            </button>
        </div>
    );
}