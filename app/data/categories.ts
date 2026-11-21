import { PLAYERS, type Player } from "./players";

// The answer to every question is one of the friends.
export type Question = {
  text: string;
  answer: Player;
  audio?: string; // path under /public, e.g. "/music/1.m4a"
  image?: string; // photo to guess, path under /public
  // Shown on the answers screen after the round.
  track?: { artist: string; title: string; cover: string };
};
export type Category = {
  id: string;
  title: string;
  questions: Question[];
  plainSelect?: boolean; // plain dropdown instead of the avatar picker
};

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

// Photo rounds: question i shows /public/<dir>/<file>.jpeg. Order as given.
function photoRound(
  id: string,
  title: string,
  dir: string,
  items: [Player, string][],
  plainSelect = true,
): Category {
  return {
    id,
    title,
    plainSelect,
    questions: items.map(([answer, file]) => ({
      text: "Кто на фото?",
      answer,
      image: `/${dir}/${file.includes(".") ? file : `${file}.jpeg`}`,
    })),
  };
}

const kids = photoRound("kids", "Дети", "kids", [
  ["Леша К", "aliaksei_k"],
  ["Ира", "ira"],
  ["Аня", "hanna"],
  ["Леша Г", "aliaksei_h"],
  ["Витя", "viktar"],
  ["Кристина", "kristina"],
  ["Кирилл", "kiryl"],
  ["Максим", "maksim"],
]);

// Maxim first, Леша Г last, the rest in a fixed "random" order.
// hanna_2 is deliberately unused.
const art = photoRound("art", "Изобразительное искусство", "art", [
  ["Максим", "maxim"],
  ["Кристина", "kristina"],
  ["Леша К", "aleksei_k"],
  ["Витя", "viktar"],
  ["Кирилл", "kiryl"],
  ["Ира", "ira"],
  ["Аня", "hanna"],
  ["Леша Г", "aliaksei_h"],
]);

// Gameplay screenshots in /public/games, answered with the avatar picker.
const games = photoRound(
  "games",
  "Игры",
  "games",
  [
    ["Витя", "viktar.jpg"], // Gothic 2
    ["Аня", "hanna.jpg"], // Рэкс
    ["Кирилл", "kiryl.jpg"], // Kingdom Come: Deliverance
    ["Ира", "ira.jpg"], // Balatro
    ["Леша Г", "aleksei_h.jpg"], // Mario (Dendy)
    ["Леша К", "aleksei_k.jpg"], // Oblivion
    ["Максим", "max.jpg"], // Fallout: New Vegas
    ["Кристина", "kristina.jpg"], // The Sims 3
  ],
  false,
);

export const CATEGORIES: Category[] = [
  withAudio(placeholder("music", "Музыка")),
  art,
  games,
  kids,
];
