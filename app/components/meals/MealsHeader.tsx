type MealsHeaderProps = {
    title: string;
};

export function MealsHeader({ title }: MealsHeaderProps) {
    return (
        <div className="relative border-b border-[#3E2E48]/8 bg-[linear-gradient(135deg,rgba(208,169,26,0.10),rgba(255,255,255,0.72),rgba(116,132,255,0.08))] px-6 py-6 sm:px-8">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-[#d0a91a]/10 blur-3xl" />
                <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-[#b9c9ff]/20 blur-3xl" />
            </div>

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                        {title}
                    </h1>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button className="rounded-2xl border border-white/80 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:shadow-md">
                        Export
                    </button>
                </div>
            </div>
        </div>
    );
}