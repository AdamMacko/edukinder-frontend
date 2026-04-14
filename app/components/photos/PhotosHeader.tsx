type PhotosHeaderProps = {
    onCreateClick: () => void;
};

export function PhotosHeader({ onCreateClick }: PhotosHeaderProps) {
    return (
        <div className="relative border-b border-[#3E2E48]/8 bg-[linear-gradient(135deg,rgba(208,169,26,0.10),rgba(255,255,255,0.72),rgba(116,132,255,0.08))] px-6 py-6 sm:px-8">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-[#d0a91a]/10 blur-3xl" />
                <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-[#b9c9ff]/20 blur-3xl" />
            </div>

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-[#3E2E48]">
                        Fotogaléria
                    </h1>
                    <p className="mt-2 text-sm text-[#3E2E48]/65 max-w-2xl">
                        Albumy udalostí, výletov a aktivít. Ku každému eventu môžete pridať
                        názov, dátum, popis, triedy a fotografie.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={onCreateClick}
                        className="rounded-2xl bg-[#d0a91a] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#d0a91a]/20 transition hover:translate-y-[-1px] hover:shadow-xl"
                    >
                        Vytvoriť album
                    </button>
                </div>
            </div>
        </div>
    );
}