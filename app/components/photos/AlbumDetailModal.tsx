"use client";

import { PhotoAlbum, SchoolClass } from "@/lib/mock/photos";

type AlbumDetailModalProps = {
    album: PhotoAlbum | null;
    classes: SchoolClass[];
    onClose: () => void;
};

function formatDate(date: string) {
    return new Intl.DateTimeFormat("sk-SK", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(date));
}

export function AlbumDetailModal({
                                     album,
                                     classes,
                                     onClose,
                                 }: AlbumDetailModalProps) {
    if (!album) return null;

    const selectedClasses = classes.filter((c) => album.classIds.includes(c.id));

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a2130]/35 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="max-h-[70vh] w-full max-w-2xl overflow-hidden rounded-[20px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(62,46,72,0.18)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between border-b border-[#3E2E48]/8 px-6 py-5 sm:px-8">
                    <div>
                        <div className="mb-2 inline-flex rounded-full bg-[#fff7dc] px-3 py-1 text-xs font-bold tracking-wide text-[#9b7a00]">
                            Detail albumu
                        </div>
                        <h2 className="text-2xl font-black text-[#3E2E48]">{album.title}</h2>
                        <p className="mt-1 text-sm text-[#3E2E48]/60">
                            {formatDate(album.date)}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#3E2E48]/10 bg-[#faf7f4] text-xl font-semibold text-[#3E2E48]/70 transition hover:bg-[#f3ede8]"
                    >
                        ×
                    </button>
                </div>

                <div className="max-h-[calc(90vh-100px)] overflow-y-auto px-6 py-6 sm:px-8">
                    {album.description && (
                        <div className="mb-5 rounded-[24px] border border-[#3E2E48]/8 bg-[#faf7f4] px-5 py-4 text-sm text-[#3E2E48]/70">
                            {album.description}
                        </div>
                    )}

                    <div className="mb-5 flex flex-wrap gap-2">
                        {selectedClasses.map((cls) => (
                            <span
                                key={cls.id}
                                className="rounded-full bg-[#f4efea] px-3 py-1 text-xs font-semibold text-[#3E2E48]/75"
                            >
                {cls.name}
              </span>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {album.photos.map((photo) => (
                            <div
                                key={photo.id}
                                className="overflow-hidden rounded-[24px] border border-[#3E2E48]/8 bg-white shadow-sm"
                            >
                                <img
                                    src={photo.previewUrl}
                                    alt={photo.name}
                                    className="h-30 w-full object-cover"
                                />
                                <div className="p-3 text-sm font-medium text-[#3E2E48]/65">
                                    {photo.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}