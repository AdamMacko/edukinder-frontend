type Child = {
    id: string;
    name: string;
    color: string;
};

type ChildTabsProps = {
    childrenList: Child[];
    activeChildId: string;
    onChange: (childId: string) => void;
};

export function ChildTabs({
                              childrenList,
                              activeChildId,
                              onChange,
                          }: ChildTabsProps) {
    return (
        <div className="border-b border-[#3E2E48]/8 bg-white px-6 py-4 sm:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    {childrenList.map((child) => {
                        const active = activeChildId === child.id;

                        return (
                            <button
                                key={child.id}
                                onClick={() => onChange(child.id)}
                                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                                    active
                                        ? "bg-[#3E2E48] text-white shadow-md"
                                        : "border border-[#3E2E48]/10 bg-[#f8f5f2] text-[#3E2E48] hover:bg-[#f4efea]"
                                }`}
                            >
                <span
                    className={`h-2.5 w-2.5 rounded-full ${
                        active ? "bg-white" : child.color
                    }`}
                />
                                {child.name}
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf1ff] px-3 py-2 text-[#5673d8]">
            <span className="h-2 w-2 rounded-full bg-[#7fa1ff]" />
            Prihlásený
          </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#fbe7e7] px-3 py-2 text-[#bb6b6b]">
            <span className="h-2 w-2 rounded-full bg-[#e79f9f]" />
            Odhlásený
          </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#f9efcf] px-3 py-2 text-[#aa8530]">
            <span className="h-2 w-2 rounded-full bg-[#e2c26a]" />
            Čiastočne
          </span>
                </div>
            </div>
        </div>
    );
}