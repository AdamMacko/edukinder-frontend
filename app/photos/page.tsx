"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { Header } from "@/app/components/header/Header";
import { PhotosHeader } from "@/app/components/photos/PhotosHeader";
import { PhotoAlbumsGrid } from "@/app/components/photos/PhotoAlbumsGrid";
import { CreateAlbumModal } from "@/app/components/photos/CreateAlbumModal";
import { AlbumDetailModal } from "@/app/components/photos/AlbumDetailModal";
import {
    MOCK_ALBUMS,
    MOCK_CLASSES,
    PhotoAlbum,
    PhotoItem,
} from "@/lib/mock/photos";

type DraftPhoto = {
    id: string;
    name: string;
    previewUrl: string;
};

function createId(prefix: string) {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function PhotosPage() {
    const [albums, setAlbums] = useState<PhotoAlbum[]>(MOCK_ALBUMS);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [openedAlbum, setOpenedAlbum] = useState<PhotoAlbum | null>(null);

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
    const [draftPhotos, setDraftPhotos] = useState<DraftPhoto[]>([]);

    const sortedAlbums = useMemo(() => {
        return [...albums].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }, [albums]);

    function resetForm() {
        setTitle("");
        setDate("");
        setDescription("");
        setSelectedClassIds([]);
        setDraftPhotos([]);
    }

    function handleToggleClass(id: string) {
        setSelectedClassIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }

    function handleFilesChange(e: ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);

        const newPhotos: DraftPhoto[] = files.map((file) => ({
            id: createId("draft-photo"),
            name: file.name,
            previewUrl: URL.createObjectURL(file),
        }));

        setDraftPhotos((prev) => [...prev, ...newPhotos]);
    }

    function handleRemoveDraftPhoto(id: string) {
        setDraftPhotos((prev) => prev.filter((p) => p.id !== id));
    }

    function handleCreateAlbum() {
        if (!title.trim() || !date || selectedClassIds.length === 0 || draftPhotos.length === 0) {
            return;
        }

        const photoItems: PhotoItem[] = draftPhotos.map((photo) => ({
            id: photo.id,
            name: photo.name,
            previewUrl: photo.previewUrl,
        }));

        const newAlbum: PhotoAlbum = {
            id: createId("album"),
            title: title.trim(),
            date,
            description: description.trim() || undefined,
            classIds: selectedClassIds,
            photos: photoItems,
            coverUrl: photoItems[0]?.previewUrl ?? "",
            createdAt: new Date().toISOString(),
        };

        setAlbums((prev) => [newAlbum, ...prev]);
        setIsCreateOpen(false);
        resetForm();
    }

    return (
        <>
            <Header />

            <div className="min-h-screen bg-[#fcf7f3] text-[#3E2E48]">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/70 shadow-[0_20px_60px_rgba(62,46,72,0.08)] backdrop-blur-xl">
                        <PhotosHeader onCreateClick={() => setIsCreateOpen(true)} />

                        <PhotoAlbumsGrid
                            albums={sortedAlbums}
                            classes={MOCK_CLASSES}
                            onOpenAlbum={setOpenedAlbum}
                        />
                    </div>
                </div>

                <CreateAlbumModal
                    open={isCreateOpen}
                    title={title}
                    date={date}
                    description={description}
                    selectedClassIds={selectedClassIds}
                    classes={MOCK_CLASSES}
                    draftPhotos={draftPhotos}
                    onTitleChange={setTitle}
                    onDateChange={setDate}
                    onDescriptionChange={setDescription}
                    onToggleClass={handleToggleClass}
                    onFilesChange={handleFilesChange}
                    onRemoveDraftPhoto={handleRemoveDraftPhoto}
                    onClose={() => {
                        setIsCreateOpen(false);
                        resetForm();
                    }}
                    onCreate={handleCreateAlbum}
                />

                <AlbumDetailModal
                    album={openedAlbum}
                    classes={MOCK_CLASSES}
                    onClose={() => setOpenedAlbum(null)}
                />
            </div>
        </>
    );
}