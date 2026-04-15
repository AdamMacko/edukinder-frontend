"use client";

import { useMemo, useState } from "react";

type Child = {
    id: string;
    name: string;
    color: string;
};

type RangeCancellationFormProps = {
    childrenList: Child[];
    activeChildId: string;
    onChildChange: (childId: string) => void;
    onSubmit: (payload: {
        childId: string;
        from: string;
        to: string;
        scope: "full_day" | "lunch";
    }) => Promise<void>;
};

function countWorkingDays(from: string, to: string) {
    if (!from || !to) return 0;

    const start = new Date(from);
    const end = new Date(to);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
    if (start > end) return 0;

    let count = 0;
    const d = new Date(start);

    while (d <= end) {
        const day = d.getDay();
        if (day !== 0 && day !== 6) count++;
        d.setDate(d.getDate() + 1);
    }

    return count;
}

export function RangeCancellationForm({
                                          childrenList,
                                          activeChildId,
                                          onChildChange,
                                          onSubmit,
                                      }: RangeCancellationFormProps) {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [scope, setScope] = useState<"full_day" | "lunch">("full_day");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const activeChild = childrenList.find((c) => c.id === activeChildId) ?? null;
    const workingDays = useMemo(() => countWorkingDays(from, to), [from, to]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!activeChildId) {
            setError("Vyberte dieťa.");
            return;
        }

        if (!from || !to) {
            setError("Vyplňte dátum od a do.");
            return;
        }

        if (new Date(from) > new Date(to)) {
            setError("Dátum Od nesmie byť neskôr ako dátum Do.");
            return;
        }

        if (workingDays === 0) {
            setError("V zvolenom období nie je žiadny pracovný deň.");
            return;
        }

        try {
            setLoading(true);

            await onSubmit({
                childId: activeChildId,
                from,
                to,
                scope,
            });

            setSuccess(
                scope === "full_day"
                    ? `Dieťa ${activeChild?.name ?? ""} bolo odhlásené na ${workingDays} pracovných dní.`
                    : `Obed bol odhlásený na ${workingDays} pracovných dní.`
            );
        } catch (err) {
            console.error(err);
            setError("Nepodarilo sa uložiť odhlásenie na viac dní.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="px-6 py-6 sm:px-8">
            <div className="rounded-[28px] border border-[#3E2E48]/8 bg-[#fcfaf8] p-5 sm:p-6">
                <div className="mb-5">
                    <h3 className="text-2xl font-black tracking-tight text-[#3E2E48]">
                        Odhlásiť na viac dní
                    </h3>
                    <p className="mt-2 text-sm text-[#3E2E48]/60">
                        Vhodné pri chorobe, dovolenke alebo dlhšej neprítomnosti.
                        Víkendy sa automaticky preskočia.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#3E2E48]">
                            Dieťa
                        </label>

                        <div className="overflow-x-auto">
                            <div className="flex w-max gap-2">
                                {childrenList.map((child) => {
                                    const active = activeChildId === child.id;

                                    return (
                                        <button
                                            key={child.id}
                                            type="button"
                                            onClick={() => onChildChange(child.id)}
                                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                                                active
                                                    ? "bg-[#3E2E48] text-white shadow-md"
                                                    : "border border-[#3E2E48]/10 bg-white text-[#3E2E48] hover:bg-[#f4efea]"
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
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-[#3E2E48]">
                                Od
                            </label>
                            <input
                                type="date"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="w-full rounded-2xl border border-[#3E2E48]/10 bg-white px-4 py-3 text-sm font-medium text-[#3E2E48] outline-none transition focus:border-[#d0a91a]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-[#3E2E48]">
                                Do
                            </label>
                            <input
                                type="date"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="w-full rounded-2xl border border-[#3E2E48]/10 bg-white px-4 py-3 text-sm font-medium text-[#3E2E48] outline-none transition focus:border-[#d0a91a]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#3E2E48]">
                            Rozsah odhlásenia
                        </label>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => setScope("full_day")}
                                className={`rounded-[20px] border px-4 py-4 text-left transition ${
                                    scope === "full_day"
                                        ? "border-[#d0a91a] bg-[#fff7dc] ring-2 ring-[#d0a91a]/20"
                                        : "border-[#3E2E48]/10 bg-white hover:bg-[#faf7f4]"
                                }`}
                            >
                                <div className="font-bold text-[#3E2E48]">Celý deň</div>
                                <div className="mt-1 text-sm text-[#3E2E48]/60">
                                    Odhlási desiatu, obed aj olovrant.
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setScope("lunch")}
                                className={`rounded-[20px] border px-4 py-4 text-left transition ${
                                    scope === "lunch"
                                        ? "border-[#d0a91a] bg-[#fff7dc] ring-2 ring-[#d0a91a]/20"
                                        : "border-[#3E2E48]/10 bg-white hover:bg-[#faf7f4]"
                                }`}
                            >
                                <div className="font-bold text-[#3E2E48]">Iba obed</div>
                                <div className="mt-1 text-sm text-[#3E2E48]/60">
                                    Odhlási iba obed, ostatné jedlá ostanú.
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="rounded-[20px] border border-[#d0a91a]/20 bg-[#fffaf0] px-4 py-4 text-sm text-[#8c6c00]">
                        <div className="font-semibold">Náhľad odhlásenia</div>
                        <div className="mt-1">
                            {workingDays > 0
                                ? `Odhlási sa ${workingDays} pracovných dní.`
                                : "Vyberte dátum od a do."}
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-[20px] border border-[#f0caca] bg-[#fbe7e7] px-4 py-3 text-sm font-medium text-[#b15252]">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-[20px] border border-[#cfe7bf] bg-[#f4fbef] px-4 py-3 text-sm font-medium text-[#4b6634]">
                            {success}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-2xl bg-[#d0a91a] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#d0a91a]/20 transition hover:translate-y-[-1px] hover:shadow-xl disabled:opacity-60"
                        >
                            {loading ? "Ukladám..." : "Potvrdiť odhlásenie"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}