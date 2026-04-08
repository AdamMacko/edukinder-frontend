type CheckboxCellProps = {
    checked: boolean;
    onChange: (value: boolean) => void;
    accent?: boolean;
};

export function CheckboxCell({
                                 checked,
                                 onChange,
                                 accent = false,
                             }: CheckboxCellProps) {
    return (
        <div className="flex justify-center">
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                    checked
                        ? accent
                            ? "border-[#d0a91a] bg-[#fff4cb] text-[#9b7a00] shadow-sm"
                            : "border-[#88a6ff] bg-[#edf3ff] text-[#4d69cb] shadow-sm"
                        : "border-[#3E2E48]/12 bg-white text-transparent hover:bg-[#f8f5f2]"
                }`}
            >
                <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M16.704 5.29a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.414 0l-3-3A1 1 0 016.504 9.49l2.293 2.293 6.493-6.493a1 1 0 011.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </div>
    );
}