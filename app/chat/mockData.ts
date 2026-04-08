export const MOCK_CONVERSATIONS = [
  {
    id: 1,
    name: "Jana Slobodová",
    role: "Rodič (Miško)",
    avatar: "JS",
    unread: 2,
    online: true,
    lastMessage: "Dobrý deň, Miško má dnes trochu soplík, necháme si ho...",
    time: "10:42",
    messages: [
      { id: 101, senderId: 1, text: "Dobrý deň, Miško má dnes trochu soplík, necháme si ho doma. Ospravedlňte ho prosím zo stravy.", time: "10:40", isMe: false },
      { id: 102, senderId: "me", text: "Dobrý deň pani Slobodová, rozumiem. Prajeme Miškovi skoré uzdravenie! Stravu som odhlásila.", time: "10:42", isMe: true },
    ]
  },
  {
    id: 2,
    name: "Andrej Múdry",
    role: "Rodič (Ema)",
    avatar: "AM",
    unread: 0,
    online: false,
    lastMessage: "Ďakujem za fotky z výletu, sú super!",
    time: "Včera",
    messages: [
      { id: 201, senderId: "me", text: "Dobrý deň, do galérie som nahrala fotky z dnešného výletu na farmu.", time: "Včera 15:30", isMe: true },
      { id: 202, senderId: 2, text: "Ďakujem za fotky z výletu, sú super! Emka o tom básnila celú cestu domov.", time: "Včera 17:45", isMe: false },
    ]
  },
  {
    id: 3,
    name: "Riaditeľka",
    role: "Vedenie",
    avatar: "R",
    unread: 0,
    online: true,
    lastMessage: "Nezabudni prosím vyplniť dochádzku do 12:00.",
    time: "Pondelok",
    messages: [
      { id: 301, senderId: 3, text: "Ahoj, nezabudni prosím vyplniť dochádzku do 12:00 kvôli jedálni.", time: "Pondelok 09:00", isMe: false },
      { id: 302, senderId: "me", text: "Ahoj, jasné, už je to tam naklikané.", time: "Pondelok 09:05", isMe: true },
    ]
  }
];