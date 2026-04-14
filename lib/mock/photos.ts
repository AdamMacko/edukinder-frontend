export type SchoolClass = {
    id: string;
    name: string;
};

export type PhotoItem = {
    id: string;
    name: string;
    previewUrl: string;
};

export type PhotoAlbum = {
    id: string;
    title: string;
    date: string;
    description?: string;
    classIds: string[];
    photos: PhotoItem[];
    coverUrl: string;
    createdAt: string;
};

export const MOCK_CLASSES: SchoolClass[] = [
    { id: "zabky", name: "Žabky" },
    { id: "lisky", name: "Líšky" },
    { id: "vcielky", name: "Včielky" },
    { id: "motyliky", name: "Motýliky" },
];

export const MOCK_ALBUMS: PhotoAlbum[] = [
    {
        id: "album-1",
        title: "Jarná prechádzka",
        date: "2026-04-05",
        description: "Spoločná jarná prechádzka do parku a pozorovanie prírody.",
        classIds: ["zabky", "vcielky"],
        coverUrl:
            "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80",
        createdAt: "2026-04-05T14:00:00Z",
        photos: [
            {
                id: "p1",
                name: "prechadzka-1.jpg",
                previewUrl:
                    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80",
            },
            {
                id: "p2",
                name: "prechadzka-2.jpg",
                previewUrl:
                    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80",
            },
            {
                id: "p3",
                name: "prechadzka-3.jpg",
                previewUrl:
                    "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=1200&q=80",
            },
        ],
    },
    {
        id: "album-2",
        title: "Veľkonočné tvorenie",
        date: "2026-03-28",
        description: "Deti vyrábali kraslice, zajačikov a jarné dekorácie.",
        classIds: ["lisky"],
        coverUrl:
            "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80",
        createdAt: "2026-03-28T11:30:00Z",
        photos: [
            {
                id: "p4",
                name: "tvorenie-1.jpg",
                previewUrl:
                    "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80",
            },
            {
                id: "p5",
                name: "tvorenie-2.jpg",
                previewUrl:
                    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80",
            },
        ],
    },
];