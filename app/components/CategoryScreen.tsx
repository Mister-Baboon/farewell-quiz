"use client";

import { CATEGORIES, type Category } from "../data/categories";
import { type Progress } from "../lib-progress";
import styles from "./screens.module.css";

export default function CategoryScreen({
  progress,
  canReview,
  onPick,
  onReview,
}: {
  progress: Progress;
  canReview: (c: Category) => boolean;
  onPick: (c: Category) => void;
  onReview: (c: Category) => void;
}) {
  return (
    <section className={styles.section}>
      <h1 className={styles.title}>Выбери категорию</h1>
      <div className={styles.categories}>
        {CATEGORIES.map((cat) => {
          const guesses = progress[cat.id] ?? [];
          const total = cat.questions.length;
          const done = guesses.length >= total;
          const started = guesses.length > 0 && !done;
          const correct = guesses.filter(
            (g, i) => g === cat.questions[i]?.answer,
          ).length;

          return (
            <div key={cat.id} className={styles.categoryWrap}>
              <button
                className={styles.category}
                disabled={done}
                onClick={() => onPick(cat)}
              >
                <span className={styles.catTitle}>{cat.title}</span>
                <span className={styles.catStatus}>
                  {done
                    ? `Верно: ${correct} из ${total}`
                    : started
                      ? `Продолжить · вопрос ${guesses.length + 1} из ${total}`
                      : `${total} вопросов`}
                </span>
              </button>
              {done && canReview(cat) && (
                <button
                  className={styles.reviewBtn}
                  onClick={() => onReview(cat)}
                >
                  Посмотреть ответы
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
