"use client";

import { useState } from "react";
import { type Category } from "../data/categories";
import { PLAYERS, type Player } from "../data/players";
import MemeCarousel from "./MemeCarousel";
import AvatarPicker from "./AvatarPicker";
import { asset } from "../lib-asset";
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
  const [choice, setChoice] = useState<Player | "">(category.plainSelect ? "" : PLAYERS[0]);
  const question = category.questions[index];

  return (
    <form
      className={styles.section}
      onSubmit={(e) => {
        e.preventDefault();
        if (choice) onAnswer(choice);
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

      {question.images && <MemeCarousel images={question.images} />}
      {question.image && (
        <div className={styles.photo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(question.image)} alt="" />
        </div>
      )}
      {question.caption && <p className={styles.caption}>{question.caption}</p>}

      {category.plainSelect ? (
        <label className={styles.label}>
          Кто это?
          <select
            className={styles.select}
            value={choice}
            onChange={(e) => setChoice(e.target.value as Player | "")}
          >
            <option value="">— выбери —</option>
            {PLAYERS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <AvatarPicker
          label="Кто это?"
          value={choice || PLAYERS[0]}
          onChange={setChoice}
        />
      )}

      <div className={styles.actions}>
        <button className={styles.primary} type="submit" disabled={!choice}>
          Подтвердить
        </button>
        <button className={styles.ghost} type="button" onClick={onBack}>
          К категориям
        </button>
      </div>
    </form>
  );
}
