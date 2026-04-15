"use client";

type CancellationMode = "calendar" | "range";

type CancellationModeSwitchProps = {
    value: CancellationMode;
    onChange: (value: CancellationMode) => void;
};

export function CancellationModeSwitch({
                                           value,
                                           onChange,
                                       }: CancellationModeSwitchProps) {
    return (
        <div className="border-b border-[#3E2E48]/8 bg-white px-6 py-4 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-black text-[#3E2E48]">
                        Spôsob odhlasovania
                    </h2>
                    <p className="mt-1 text-sm text-[#3E2E48]/60">
                        Vyberte, či chcete upraviť jednotlivé dni v kalendári alebo
                        odhlásiť dieťa na viac dní naraz.
                    </p>
                </div>

                <div className="flex rounded-2xl bg-[#f8f5f2] p-1">
                    <button
                        type="button"
                        onClick={() => onChange("calendar")}
                        className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                            value === "calendar"
                                ? "bg-[#3E2E48] text-white shadow-sm"
                                : "text-[#3E2E48]/70 hover:bg-white"
                        }`}
                    >
                        Kalendár
                    </button>

                    <button
                        type="button"
                        onClick={() => onChange("range")}
                        className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                            value === "range"
                                ? "bg-[#3E2E48] text-white shadow-sm"
                                : "text-[#3E2E48]/70 hover:bg-white"
                        }`}
                    >
                        Odhlásiť na viac dní
                    </button>
                </div>
            </div>
        </div>
    );
}