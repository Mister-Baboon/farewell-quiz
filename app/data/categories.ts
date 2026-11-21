import { PLAYERS, type Player } from "./players";

// The answer to every question is one of the friends.
export type Question = {
  text: string;
  answer: Player;
  audio?: string; // path under /public, e.g. "/music/1.m4a"
  // Shown on the answers screen after the round.
  track?: { artist: string; title: string; cover: string };
};
export type Category = { id: string; title: string; questions: Question[] };

// Placeholder questions: replace `text` and `answer` with the real ones.
const placeholder = (id: string, title: string): Category => ({
  id,
  title,
  questions: PLAYERS.map((answer, i) => ({
    text: `${title}: вопрос ${i + 1}`,
    answer,
  })),
});

// Music round: question i plays /public/music/<i+1>.m4a.
// Whose track it is, in order. The 8th was not given: Кирилл is the only
// player not listed, so it is assumed.
const MUSIC_ANSWERS: Player[] = [
  "Максим",
  "Аня",
  "Кристина",
  "Витя",
  "Ира",
  "Леша Г",
  "Леша К",
  "Кирилл",
];

const MUSIC_TRACKS = [
  ["Antimatter", "Fold"],
  ["Shirra", "Dance with Me"],
  ["Серебряная свадьба", "Я жизнь люблю"],
  ["Car Seat Headrest", "Something Soon"],
  ["Aphex Twin", "Xtal"],
  ["Polyn", "Starost"],
  ["Пневмослон", "Пошло всё в жопу, сяду на коня"],
  ["Ядра Чу", "Анекдот"],
];

function withAudio(cat: Category): Category {
  return {
    ...cat,
    questions: cat.questions.map((q, i) => ({
      ...q,
      text: "Чей это трек?",
      answer: MUSIC_ANSWERS[i],
      audio: `/music/${i + 1}.m4a`,
      track: {
        artist: MUSIC_TRACKS[i][0],
        title: MUSIC_TRACKS[i][1],
        cover: `/covers/${i + 1}.jpg`,
      },
    })),
  };
}

export const CATEGORIES: Category[] = [
  placeholder("attribute", "Аттрибут"),
  withAudio(placeholder("music", "Музыка")),
  placeholder("art", "Изобразительное искусство"),
  placeholder("games", "Игры"),
];
