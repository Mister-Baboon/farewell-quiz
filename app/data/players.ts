export const PLAYERS = [
  "Аня",
  "Леша Г",
  "Леша К",
  "Максим",
  "Кирилл",
  "Ира",
  "Кристина",
  "Витя",
] as const;

export type Player = (typeof PLAYERS)[number];

// A guest can play but is never an answer option.
export const GUEST = "Гость";
export const ACCOUNTS = [...PLAYERS, GUEST] as const;
export type Account = Player | typeof GUEST;

// Files live in public/avatars. Леша К → katorats is an assumption.
export const AVATARS: Record<Player, string> = {
  "Аня": "/avatars/hanna.jpg",
  "Леша Г": "/avatars/aleksei_h.jpg",
  "Леша К": "/avatars/katorats.jpg",
  "Максим": "/avatars/maksim.jpg",
  "Кирилл": "/avatars/kiryl.jpeg",
  "Ира": "/avatars/iren.jpg",
  "Кристина": "/avatars/kristina.jpg",
  "Витя": "/avatars/viktar.jpg",
};
