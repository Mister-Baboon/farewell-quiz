import { PLAYERS, type Player } from "./players";

// The answer to every question is one of the friends.
export type Question = {
  text: string;
  answer: Player;
  audio?: string; // path under /public, e.g. "/music/1.m4a"
  image?: string; // photo to guess, path under /public
  images?: string[]; // several pictures for one question (swipeable)
  caption?: string; // shown with the photo (e.g. the dish name)
  revealCaption?: string; // shown only on the answers screen
  // Shown on the answers screen after the round.
  track?: { artist: string; title: string; cover: string };
};
export type Category = {
  id: string;
  title: string;
  description?: string; // shown on the category card
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
  items: [Player, string, string?][],
  plainSelect = true,
  captionOnReveal = false,
): Category {
  return {
    id,
    title,
    plainSelect,
    questions: items.map(([answer, file, caption]) => ({
      text: caption ? "Кто это заказал?" : "Кто на фото?",
      ...(captionOnReveal ? { revealCaption: caption } : { caption }),
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
    ["Витя", "viktar.jpg", "Gothic II"],
    ["Аня", "hanna.jpg", "Рэкс"],
    ["Кирилл", "kiryl.jpg", "Kingdom Come: Deliverance"],
    ["Ира", "ira.jpg", "Balatro"],
    ["Леша Г", "aleksei_h.jpg", "Mario на Dendy (на двоих)"],
    ["Леша К", "aleksei_k.jpg", "Fortnite"],
    ["Максим", "max.jpg", "Fallout: New Vegas"],
    ["Кристина", "kristina.png", "EPAM Onboarding Gamification"],
  ],
  false,
  true, // game names are revealed only on the answers screen
);

// Georgian food: who ordered which dish. Photos /public/food/<n>.jpg in order.
const food = photoRound(
  "food",
  "Грузинская кухня",
  "food",
  [
    ["Леша Г", "1.jpg", "Суп харчо"],
    ["Леша К", "2.jpg", "Хинкали"],
    ["Кирилл", "3.jpg", "Хачапури"],
    ["Аня", "4.jpg", "McDonald's Биг Тейсти"],
    ["Кристина", "5.jpg", "Запечённые креветки"],
    ["Ира", "6.jpg", "Чакапули (говядина)"],
    ["Максим", "7.jpg", "Куриный шашлык"],
    ["Витя", "8.jpg", "Мамалыга"],
  ],
  false,
);

// Memes: several pictures per question, files /public/memes/<q>_<n>.<ext>.
const MEME_FILES: [Player, string[]][] = [
  ["Леша Г", ["1_1.jpg", "1_2.jpg"]],
  ["Максим", ["2_1.jpg", "2_2.jpg"]],
  ["Витя", ["3_1.jpg", "3_2.jpeg", "3_3.jpg"]],
  ["Леша К", ["4_1.jpg", "4_2.jpeg", "4_3.jpg"]],
  ["Аня", ["5_1.jpg", "5_2.jpg", "5_3.jpg"]],
  ["Ира", ["6_1.jpg", "6_2.jpg"]],
  ["Кристина", ["7_1.jpeg", "7_2.jpg"]],
  ["Кирилл", ["8_1.mp4", "8_2.jpg", "8_3.jpeg"]],
];

const memes: Category = {
  id: "memes",
  title: "Мемы",
  questions: MEME_FILES.map(([answer, files]) => ({
    text: "Чьи это мемы?",
    answer,
    images: files.map((f) => `/memes/${f}`),
  })),
};

const DESCRIPTIONS: Record<string, string> = {
  music:
    "На входе прозвучит песня, как в нелюбимом раунде на квизах. Но угадывать нужно не исполнителя, а слушателя: кому она нравится и кто бы взял её на квиз.",
  art: "На входе картина импрессиониста: оригинальное фото → текстовое описание → заказ Ренуару, Моне и Дега по этому описанию.",
  kids: "На входе изображение в возрасте 5 лет, полученное с помощью нейросети.",
  games:
    "Кто в это играл и, возможно, даже полюбил. А возможно, не играл, но связан. А возможно, и не связан.",
  food: "Будет сложно: просто блюдо без контекста.",
  memes:
    "На входе 2–3 мема: нужно угадать человека, которому они нравятся или с которым связаны. Листай свайпом, картинки идут по кругу.",
};

const ALL: Category[] = [
  withAudio(placeholder("music", "Музыка")),
  art,
  games,
  kids,
  food,
  memes,
];

export const CATEGORIES: Category[] = ALL.map((c) => ({
  ...c,
  description: DESCRIPTIONS[c.id],
}));
