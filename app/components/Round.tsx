'use client';

import { useEffect, useRef, useState } from 'react';
import { CATEGORIES, type Category } from '../data/categories';
import { type Account } from '../data/players';
import { asset } from '../lib-asset';
import { useAudio } from '../lib-audio';
import { saveAnswer, useProgress } from '../lib-progress';
import CategoryScreen from './CategoryScreen';
import QuestionScreen from './QuestionScreen';
import ReviewScreen from './ReviewScreen';

// On the answers screen each song only plays for this long.
const REVIEW_SECONDS = 15;

type View =
  | { mode: 'quiz'; id: string }
  | { mode: 'review'; id: string; index: number }
  | null;

// Silent (photo) rounds show each answer for this long.
const PHOTO_REVIEW_SECONDS = 8;

const hasReview = (c: Category) => c.questions.every((q) => q.track || q.image);
const reviewSeconds = (c: Category) =>
  c.questions.some((q) => q.audio) ? REVIEW_SECONDS : PHOTO_REVIEW_SECONDS;

// Category screen -> questions -> answers, for one player.
export default function Round({ player }: { player: Account }) {
  const progress = useProgress(player);
  const [view, setView] = useState<View>(null);
  // In the answers view a finished (10 s) track moves on by itself.
  const nextRef = useRef<() => void>(() => {});
  const audio = useAudio(() => nextRef.current());

  // Audio helpers: always call these from a click handler.
  const playQuestion = (cat: Category, index: number) => {
    const src = cat.questions[index]?.audio;
    if (src) audio.play(asset(src));
    else audio.stop();
  };
  const playReview = (cat: Category, index: number) => {
    const src = cat.questions[index]?.audio;
    if (src) audio.play(asset(src), REVIEW_SECONDS);
    else audio.stop();
  };
  const leave = () => {
    audio.stop();
    setView(null);
  };

  const cat = CATEGORIES.find((c) => c.id === view?.id);

  const nextReview = () => {
    if (view?.mode !== 'review' || !cat) return;
    if (view.index + 1 >= cat.questions.length) return leave();
    playReview(cat, view.index + 1);
    setView({ mode: 'review', id: cat.id, index: view.index + 1 });
  };
  useEffect(() => {
    nextRef.current = nextReview;
  });

  const categoryScreen = (
    <CategoryScreen
      progress={progress}
      canReview={hasReview}
      onPick={(c) => {
        playQuestion(c, (progress[c.id] ?? []).length);
        setView({ mode: 'quiz', id: c.id });
      }}
      onReview={(c) => {
        playReview(c, 0);
        setView({ mode: 'review', id: c.id, index: 0 });
      }}
    />
  );
  if (!view || !cat) return categoryScreen;

  const guesses = progress[cat.id] ?? [];

  if (view.mode === 'review') {
    return (
      <ReviewScreen
        key={view.index}
        category={cat}
        index={view.index}
        guess={guesses[view.index]}
        playing={audio.playing}
        onReplay={audio.replay}
        seconds={reviewSeconds(cat)}
        elapsed={audio.time.current}
        onNext={nextReview}
      />
    );
  }

  const index = guesses.length;
  if (index >= cat.questions.length) return categoryScreen; // already done

  return (
    <QuestionScreen
      key={`${cat.id}-${index}`}
      category={cat}
      index={index}
      audio={
        cat.questions[index].audio
          ? { ...audio, onReplay: audio.replay }
          : undefined
      }
      onAnswer={(guess) => {
        saveAnswer(player, cat.id, guess);
        if (index + 1 < cat.questions.length) {
          playQuestion(cat, index + 1);
        } else if (hasReview(cat)) {
          // Round finished: show the answers right away.
          playReview(cat, 0);
          setView({ mode: 'review', id: cat.id, index: 0 });
        } else {
          leave();
        }
      }}
      onBack={leave}
    />
  );
}
