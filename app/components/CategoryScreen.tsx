"use client";

import { CATEGORIES, type Category } from "../data/categories";
import { type Progress } from "../lib-progress";
import { isFinished } from "../lib-results";
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
  const finished = isFinished(progress);
  const total = CATEGORIES.reduce((s, c) => s + c.questions.length, 0);
  const score = CATEGORIES.reduce(
    (s, c) =>
      s +
      (progress[c.id] ?? []).filter((g, i) => g === c.questions[i]?.answer)
        .length,
    0,
  );

  return (
    <section className={styles.section}>
      {finished ? (
        <div className={styles.finalScore}>
          <span className={styles.finalLabel}>Все раунды пройдены</span>
          <span className={styles.finalValue}>
            {score} <small>из {total}</small>
          </span>
        </div>
      ) : (
        <h1 className={styles.title}>Выбери категорию</h1>
      )}
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
                {cat.description && (
                  <span className={styles.catDesc}>{cat.description}</span>
                )}
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
