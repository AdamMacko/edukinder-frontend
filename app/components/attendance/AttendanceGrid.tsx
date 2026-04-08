import { AttendanceState, Child } from "@/app/types/attendance";

type AttendanceGridProps = {
    childrenList: Child[];
    attendance: Record<string, AttendanceState>;
    onToggleStatus: (childId: number) => void;
};

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

function getStatusCardClasses(status: AttendanceState) {
    switch (status) {
        case "PRESENT":
            return "border-[#bfd3ff] bg-[#eaf1ff] hover:bg-[#dfe9ff]";
        case "ABSENT":
            return "border-[#f0caca] bg-[#fbe7e7] hover:bg-[#f8dddd]";
        case "SICK":
            return "border-[#ecd9a0] bg-[#f9efcf] hover:bg-[#f7e7b7]";
    }
}

function getStatusTextClasses(status: AttendanceState) {
    switch (status) {
        case "PRESENT":
            return "text-[#4b63c9]";
        case "ABSENT":
            return "text-[#c56a6a]";
        case "SICK":
            return "text-[#9e7a1f]";
    }
}

export function AttendanceGrid({
                                   childrenList,
                                   attendance,
                                   onToggleStatus,
                               }: AttendanceGridProps) {
    return (
        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {childrenList.map((child) => {
                    const state = attendance[String(child.id)] ?? "PRESENT";

                    return (
                        <button
                            key={child.id}
                            onClick={() => onToggleStatus(child.id)}
                            className={`min-h-[118px] rounded-[24px] border p-4 text-center transition-all duration-200 ${getStatusCardClasses(
                                state
                            )}`}
                        >
                            <div
                                className={`text-base font-extrabold leading-tight ${getStatusTextClasses(
                                    state
                                )}`}
                            >
                                {child.name}
                            </div>

                            <div
                                className={`mt-2 text-xs font-semibold ${getStatusTextClasses(
                                    state
                                )}`}
                            >
                                {getStatusLabel(state)}
                            </div>

                            <div className="mt-5 text-sm text-[#3E2E48]/45">
                                Kliknutím zmeniť stav
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}