"use client";

import { useState } from "react";
import { type Category } from "../data/categories";
import { PLAYERS, type Player } from "../data/players";
import AvatarPicker from "./AvatarPicker";
import NowPlaying from "./NowPlaying";
import styles from "./screens.module.css";

export default function QuestionScreen({
  category,
  index,
  onAnswer,
  onBack,
  audio,
}: {
  category: Category;
  index: number;
  onAnswer: (guess: Player) => void;
  onBack: () => void;
  audio?: {
    playing: boolean;
    time: { current: number; duration: number };
    onReplay: () => void;
  };
}) {
  const [choice, setChoice] = useState<Player>(PLAYERS[0]);
  const question = category.questions[index];

  return (
    <form
      className={styles.section}
      onSubmit={(e) => {
        e.preventDefault();
        onAnswer(choice);
      }}
    >
      <div className={styles.meta}>
        {category.title} · вопрос {index + 1} из {category.questions.length}
      </div>
      <p className={styles.question}>{question.text}</p>

      {audio && (
        <NowPlaying
          playing={audio.playing}
          current={audio.time.current}
          duration={audio.time.duration}
          onReplay={audio.onReplay}
        />
      )}

      <AvatarPicker label="Кто это?" value={choice} onChange={setChoice} />

      <div className={styles.actions}>
        <button className={styles.primary} type="submit">
          Подтвердить
        </button>
        <button className={styles.ghost} type="button" onClick={onBack}>
          К категориям
        </button>
      </div>
    </form>
  );
}
