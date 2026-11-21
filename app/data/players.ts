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
