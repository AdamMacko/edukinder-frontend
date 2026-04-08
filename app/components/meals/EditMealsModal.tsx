import { CheckboxCell } from "./CheckboxCell";

type CourseKey = "snack_am" | "lunch" | "snack_pm" | "full_day";
type Meals = Record<CourseKey, boolean>;

type Child = {
    id: string;
    name: string;
    color: string;
};

type EditMealsModalProps = {
    isOpen: boolean;
    date: Date | null;
    edit: Record<string, Meals> | null;
    childrenList: Child[];
    monthNames: string[];
    weekdays: string[];
    onClose: () => void;
    onSave: () => void;
    onToggle: (childId: string, key: CourseKey, value: boolean) => void;
};

const COURSES: { key: CourseKey; label: string }[] = [
    { key: "snack_am", label: "Desiata" },
    { key: "lunch", label: "Obed" },
    { key: "snack_pm", label: "Olovrant" },
    { key: "full_day", label: "Celý deň" },
];

export function EditMealsModal({
                                   isOpen,
                                   date,
                                   edit,
                                   childrenList,
                                   monthNames,
                                   weekdays,
                                   onClose,
                                   onSave,
                                   onToggle,
                               }: EditMealsModalProps) {
    if (!isOpen || !date || !edit) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a2130]/35 p-4 backdrop-blur-sm">
            <div className="w-full max-w-3xl rounded-[32px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(62,46,72,0.18)]">
                <div className="flex items-start justify-between border-b border-[#3E2E48]/8 px-6 py-5 sm:px-8">
                    <div>
                        <div className="mb-2 inline-flex rounded-full bg-[#fff7dc] px-3 py-1 text-xs font-bold tracking-wide text-[#9b7a00]">
                            Úprava stravy
                        </div>
                        <h2 className="text-2xl font-black">
                            {`${weekdays[(date.getDay() + 6) % 7]}, ${date.getDate()}. ${
                                monthNames[date.getMonth()]
                            }`}
                        </h2>
                        <p className="mt-1 text-sm text-[#3E2E48]/60">
                            Tu môžete upraviť jedlá pre všetky deti naraz.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#3E2E48]/10 bg-[#faf7f4] text-xl font-semibold text-[#3E2E48]/70 transition hover:bg-[#f3ede8]"
                    >
                        ×
                    </button>
                </div>

                <div className="px-6 py-6 sm:px-8">
                    <div className="overflow-x-auto">
                        <div className="min-w-[640px]">
                            <div className="grid grid-cols-[1.5fr_repeat(4,minmax(90px,1fr))] gap-3 border-b border-[#3E2E48]/8 pb-3 text-center text-xs font-extrabold uppercase tracking-wider text-[#3E2E48]/45">
                                <div className="text-left">Dieťa</div>
                                {COURSES.map((course) => (
                                    <div key={course.key}>{course.label}</div>
                                ))}
                            </div>

                            <div className="mt-4 space-y-3">
                                {childrenList.map((child) => {
                                    const meal = edit[child.id];

                                    return (
                                        <div
                                            key={child.id}
                                            className="grid grid-cols-[1.5fr_repeat(4,minmax(90px,1fr))] items-center gap-3 rounded-[24px] border border-[#3E2E48]/8 bg-[#fcfaf8] p-4"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`h-3 w-3 rounded-full ${child.color}`} />
                                                <div className="font-semibold leading-snug">
                                                    {child.name}
                                                </div>
                                            </div>

                                            <CheckboxCell
                                                checked={meal.snack_am}
                                                onChange={(value) =>
                                                    onToggle(child.id, "snack_am", value)
                                                }
                                            />
                                            <CheckboxCell
                                                checked={meal.lunch}
                                                onChange={(value) =>
                                                    onToggle(child.id, "lunch", value)
                                                }
                                            />
                                            <CheckboxCell
                                                checked={meal.snack_pm}
                                                onChange={(value) =>
                                                    onToggle(child.id, "snack_pm", value)
                                                }
                                            />
                                            <CheckboxCell
                                                checked={meal.full_day}
                                                onChange={(value) =>
                                                    onToggle(child.id, "full_day", value)
                                                }
                                                accent
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            onClick={onClose}
                            className="rounded-2xl border border-[#3E2E48]/10 bg-white px-5 py-3 text-sm font-semibold transition hover:bg-[#faf7f4]"
                        >
                            Zrušiť
                        </button>
                        <button
                            onClick={onSave}
                            className="rounded-2xl bg-[#d0a91a] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#d0a91a]/20 transition hover:translate-y-[-1px] hover:shadow-xl"
                        >
                            Uložiť
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}