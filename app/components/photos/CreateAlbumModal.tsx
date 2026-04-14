"use client";

import { ChangeEvent, useMemo } from "react";
import { SchoolClass } from "@/lib/mock/photos";

type DraftPhoto = {
    id: string;
    name: string;
    previewUrl: string;
};

type CreateAlbumModalProps = {
    open: boolean;
    title: string;
    date: string;
    description: string;
    selectedClassIds: string[];
    classes: SchoolClass[];
    draftPhotos: DraftPhoto[];
    onTitleChange: (v: string) => void;
    onDateChange: (v: string) => void;
    onDescriptionChange: (v: string) => void;
    onToggleClass: (id: string) => void;
    onFilesChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onRemoveDraftPhoto: (id: string) => void;
    onClose: () => void;
    onCreate: () => void;
};

export function CreateAlbumModal({
                                     open,
                                     title,
                                     date,
                                     description,
                                     selectedClassIds,
                                     classes,
                                     draftPhotos,
                                     onTitleChange,
                                     onDateChange,
                                     onDescriptionChange,
                                     onToggleClass,
                                     onFilesChange,
                                     onRemoveDraftPhoto,
                                     onClose,
                                     onCreate,
                                 }: CreateAlbumModalProps) {
    const canCreate = useMemo(() => {
        return title.trim() && date && selectedClassIds.length > 0 && draftPhotos.length > 0;
    }, [title, date, selectedClassIds, draftPhotos]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a2130]/35 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-4xl rounded-[32px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(62,46,72,0.18)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between border-b border-[#3E2E48]/8 px-6 py-5 sm:px-8">
                    <div>
                        <div className="mb-2 inline-flex rounded-full bg-[#fff7dc] px-3 py-1 text-xs font-bold tracking-wide text-[#9b7a00]">
                            Nový album
                        </div>
                        <h2 className="text-2xl font-black text-[#3E2E48]">
                            Vytvoriť udalosť
                        </h2>
                        <p className="mt-1 text-sm text-[#3E2E48]/60">
                            Zadajte názov, dátum, triedy a nahrajte fotografie.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#3E2E48]/10 bg-[#faf7f4] text-xl font-semibold text-[#3E2E48]/70 transition hover:bg-[#f3ede8]"
                    >
                        ×
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-[#3E2E48]">
                                Názov udalosti
                            </label>
                            <input
                                value={title}
                                onChange={(e) => onTitleChange(e.target.value)}
                                placeholder="Napr. Návšteva ZOO"
                                className="w-full rounded-2xl border border-[#3E2E48]/10 bg-[#fcfaf8] px-4 py-3 text-sm font-medium text-[#3E2E48] outline-none transition focus:border-[#d0a91a]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-[#3E2E48]">
                                Dátum
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => onDateChange(e.target.value)}
                                className="w-full rounded-2xl border border-[#3E2E48]/10 bg-[#fcfaf8] px-4 py-3 text-sm font-medium text-[#3E2E48] outline-none transition focus:border-[#d0a91a]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-[#3E2E48]">
                                Popis <span className="text-[#3E2E48]/45 font-medium">(voliteľné)</span>
                            </label>
                            <textarea
                                rows={4}
                                value={description}
                                onChange={(e) => onDescriptionChange(e.target.value)}
                                placeholder="Krátky popis udalosti..."
                                className="w-full rounded-2xl border border-[#3E2E48]/10 bg-[#fcfaf8] px-4 py-3 text-sm font-medium text-[#3E2E48] outline-none transition focus:border-[#d0a91a]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-bold text-[#3E2E48]">
                                Triedy, ktoré sa zúčastnili
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {classes.map((cls) => {
                                    const selected = selectedClassIds.includes(cls.id);

                                    return (
                                        <button
                                            key={cls.id}
                                            type="button"
                                            onClick={() => onToggleClass(cls.id)}
                                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                                selected
                                                    ? "bg-[#3E2E48] text-white shadow-md"
                                                    : "border border-[#3E2E48]/10 bg-[#f8f5f2] text-[#3E2E48] hover:bg-[#f4efea]"
                                            }`}
                                        >
                                            {cls.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-[#3E2E48]">
                                Nahrať fotografie
                            </label>
                            <label className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d0a91a]/45 bg-[#fffaf0] px-5 py-6 text-center transition hover:bg-[#fff7e6]">
                <span className="text-base font-bold text-[#3E2E48]">
                  Kliknite alebo pretiahnite fotky
                </span>
                                <span className="mt-2 text-sm text-[#3E2E48]/55">
                  Môžete vybrať viac súborov naraz
                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={onFilesChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div>
                            <div className="mb-2 text-sm font-bold text-[#3E2E48]">
                                Náhľad fotiek
                            </div>

                            {draftPhotos.length === 0 ? (
                                <div className="rounded-[24px] border border-[#3E2E48]/8 bg-[#faf7f4] px-4 py-6 text-sm text-[#3E2E48]/55">
                                    Zatiaľ nie sú vybrané žiadne fotky.
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {draftPhotos.map((photo) => (
                                        <div
                                            key={photo.id}
                                            className="overflow-hidden rounded-[20px] border border-[#3E2E48]/8 bg-white"
                                        >
                                            <img
                                                src={photo.previewUrl}
                                                alt={photo.name}
                                                className="h-28 w-full object-cover"
                                            />
                                            <div className="p-2">
                                                <div className="truncate text-xs font-medium text-[#3E2E48]/70">
                                                    {photo.name}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => onRemoveDraftPhoto(photo.id)}
                                                    className="mt-2 text-xs font-semibold text-[#b15252]"
                                                >
                                                    Odstrániť
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-[#3E2E48]/8 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
                    <button
                        onClick={onClose}
                        className="rounded-2xl border border-[#3E2E48]/10 bg-white px-5 py-3 text-sm font-semibold text-[#3E2E48] transition hover:bg-[#faf7f4]"
                    >
                        Zrušiť
                    </button>
                    <button
                        onClick={onCreate}
                        disabled={!canCreate}
                        className="rounded-2xl bg-[#d0a91a] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#d0a91a]/20 transition hover:translate-y-[-1px] hover:shadow-xl disabled:opacity-50"
                    >
                        Vytvoriť album
                    </button>
                </div>
            </div>
        </div>
    );
}