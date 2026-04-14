import { PhotoAlbum, SchoolClass } from "@/lib/mock/photos";

type PhotoAlbumsGridProps = {
    albums: PhotoAlbum[];
    classes: SchoolClass[];
    onOpenAlbum: (album: PhotoAlbum) => void;
};

function formatDate(date: string) {
    return new Intl.DateTimeFormat("sk-SK", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(date));
}

export function PhotoAlbumsGrid({
                                    albums,
                                    classes,
                                    onOpenAlbum,
                                }: PhotoAlbumsGridProps) {
    function classNames(classIds: string[]) {
        return classes
            .filter((c) => classIds.includes(c.id))
            .map((c) => c.name)
            .join(", ");
    }

    if (!albums.length) {
        return (
            <div className="px-6 py-10 sm:px-8">
                <div className="rounded-[24px] border border-[#3E2E48]/8 bg-[#faf7f4] px-6 py-10 text-center">
                    <h2 className="text-xl font-bold text-[#3E2E48]">Zatiaľ tu nič nie je</h2>
                    <p className="mt-2 text-sm text-[#3E2E48]/60">
                        Po vytvorení prvého albumu sa tu zobrazia všetky udalosti a ich fotky.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 py-6 sm:px-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {albums.map((album) => (
                    <button
                        key={album.id}
                        onClick={() => onOpenAlbum(album)}
                        className="overflow-hidden rounded-[28px] border border-[#3E2E48]/8 bg-white text-left shadow-sm transition hover:shadow-xl"
                    >
                        <div className="relative h-44 w-full overflow-hidden">
                            <img
                                src={album.coverUrl}
                                alt={album.title}
                                className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-4">
                                <div className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#3E2E48]">
                                    {album.photos.length} fotiek
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="text-xl font-black tracking-tight text-[#3E2E48]">
                                    {album.title}
                                </h3>
                                <span className="rounded-full bg-[#fff7dc] px-3 py-1 text-xs font-bold text-[#9b7a00]">
                  {formatDate(album.date)}
                </span>
                            </div>

                            {album.description && (
                                <p className="mt-3 line-clamp-2 text-sm text-[#3E2E48]/65">
                                    {album.description}
                                </p>
                            )}

                            <div className="mt-4 flex flex-wrap gap-2">
                                {classes
                                    .filter((c) => album.classIds.includes(c.id))
                                    .map((cls) => (
                                        <span
                                            key={cls.id}
                                            className="rounded-full bg-[#f4efea] px-3 py-1 text-xs font-semibold text-[#3E2E48]/75"
                                        >
                      {cls.name}
                    </span>
                                    ))}
                            </div>

                            <div className="mt-4 text-xs font-medium text-[#3E2E48]/45">
                                Triedy: {classNames(album.classIds)}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}