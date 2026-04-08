export const MOCK_TEACHERS = [
  { id: 1, firstName: "Anna", lastName: "Nováková", email: "anna@edukinder.sk" },
  { id: 2, firstName: "Mária", lastName: "Kováčová", email: "maria@edukinder.sk" },
];

export const MOCK_CLASSES = [
  {
    id: 1,
    name: "Včielky",
    class: "A",
    roomName: "Žltá trieda",
    classYear: "2024-09-01T00:00:00.000Z",
    classTeacher: MOCK_TEACHERS[0],
  },
  {
    id: 2,
    name: "Sovičky",
    class: "B",
    roomName: "Zelená trieda",
    classYear: "2024-09-01T00:00:00.000Z",
    classTeacher: MOCK_TEACHERS[1],
  },
];

export const MOCK_CHILDREN = [
  { id: 1, firstName: "Tomáš", lastName: "Mrkvička", groupName: "Včielky", className: "1. ročník" },
  { id: 2, firstName: "Eliška", lastName: "Pekná", groupName: "Včielky", className: "1. ročník" },
  { id: 3, firstName: "Jakub", lastName: "Rýchly", groupName: "Sovičky", className: "2. ročník" },
];