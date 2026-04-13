export enum AnnouncementVisibility {
  ALL = "ALL",
  CLASS = "CLASS",
  STAFF = "STAFF"
}

export type UserMock = {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
};

export type AnnouncementMock = {
  id: number;
  title: string;
  body: string;
  author: UserMock;
  visibility: AnnouncementVisibility;
  targetClass?: string; // Pre CLASS visibility
  pinned: boolean;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLikedByMe?: boolean;
  comments?: AnnouncementCommentMock[];
};
export type AnnouncementCommentMock = {
  id: number;
  author: UserMock;
  body: string;
  createdAt: string;
  likesCount: number;
  isLikedByMe?: boolean;
};

export const currentUser: UserMock = {
  id: 1,
  firstName: "Riaditeľka",
  lastName: "Nováková",
  role: "Admin",
};

export const MOCK_ANNOUNCEMENTS: AnnouncementMock[] = [
  {
    id: 1,
    title: "Dôležité: Chrípkové prázdniny",
    body: "Vážení rodičia, z dôvodu vysokej chorobnosti detí aj personálu vyhlasuje zriaďovateľ chrípkové prázdniny od stredy 15.11. do piatku 17.11. Nástup do škôlky je v pondelok.",
    author: { id: 1, firstName: "Mária", lastName: "Nováková", role: "Riaditeľka" },
    visibility: AnnouncementVisibility.ALL,
    pinned: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // Pred 2 dňami
    likesCount: 24,
    commentsCount: 3,
    isLikedByMe: true,
    comments: [
      {
        id: 101,
        author: { id: 3, firstName: "Katarína", lastName: "Veselá", role: "Rodič (Včielky)" },
        body: "Ďakujeme za informáciu, prajeme pani učiteľkám skoré uzdravenie!",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        likesCount: 3,
        isLikedByMe: false,
      },
      {
        id: 102,
        author: { id: 4, firstName: "Peter", lastName: "Hrubý", role: "Rodič (Sovičy)" },
        body: "Dobrý deň, platí to aj pre predškolákov?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        likesCount: 0,
        isLikedByMe: false,
      }
    ],
  },
  {
    id: 2,
    title: "Výlet do ZOO - Zmena termínu",
    body: "Milí rodičia triedy Včielky, kvôli hlásenému dažďu presúvame náš výlet do ZOO zo štvrtka na budúci utorok. Čas odchodu zostáva rovnaký. Ďakujeme za pochopenie!",
    author: { id: 2, firstName: "Jana", lastName: "Malá", role: "Učiteľka" },
    visibility: AnnouncementVisibility.CLASS,
    targetClass: "Včielky",
    pinned: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // Pred 4 hodinami
    likesCount: 12,
    commentsCount: 5,
  },
  {
    id: 3,
    title: "Porada zamestnancov",
    body: "Kolegyne, pripomínam dnešnú pedagogickú poradu o 16:30 v zborovni. Témou bude príprava vianočnej besiedky.",
    author: { id: 1, firstName: "Mária", lastName: "Nováková", role: "Riaditeľka" },
    visibility: AnnouncementVisibility.STAFF,
    pinned: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // Pred 30 min
    likesCount: 4,
    commentsCount: 0,
  }
];