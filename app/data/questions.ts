export type Question = { value: number; question: string; answer: string };
export type Category = { title: string; questions: Question[] };

// Placeholder content: replace with the real questions.
const VALUES = [100, 200, 300, 400, 500];

const make = (title: string): Category => ({
  title,
  questions: VALUES.map((value) => ({
    value,
    question: `${title}: вопрос на ${value}`,
    answer: "Ответ",
  })),
});

export const CATEGORIES: Category[] = [
  make("Категория 1"),
  make("Категория 2"),
  make("Категория 3"),
  make("Категория 4"),
  make("Категория 5"),
];
