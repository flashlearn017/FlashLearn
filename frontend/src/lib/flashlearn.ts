export type ReviewRating = "again" | "hard" | "easy";

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  dueAt: string;
  intervalDays: number;
  reviewCount: number;
};

export type Deck = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  cards: Flashcard[];
};

export type TestQuestion = {
  id: string;
  sourceCardId?: string;
  sourceDeckId?: string;
  prompt: string;
  choices: string[];
  correctAnswer: string;
};

export type PracticeTest = {
  id: string;
  title: string;
  durationMinutes: number;
  createdAt: string;
  questions: TestQuestion[];
};

const DECKS_KEY = "flashlearn.decks";
const TESTS_KEY = "flashlearn.tests";

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getDecks() {
  return readJson<Deck[]>(DECKS_KEY, seedDecks());
}

export function saveDecks(decks: Deck[]) {
  writeJson(DECKS_KEY, decks);
}

export function getTests() {
  return readJson<PracticeTest[]>(TESTS_KEY, seedTests());
}

export function saveTests(tests: PracticeTest[]) {
  writeJson(TESTS_KEY, tests);
}

export function getDueCards(decks: Deck[]) {
  const now = Date.now();
  return decks.flatMap((deck) =>
    deck.cards
      .filter((card) => new Date(card.dueAt).getTime() <= now)
      .map((card) => ({ ...card, deckId: deck.id, deckTitle: deck.title })),
  );
}

export function getAllCards(decks: Deck[]) {
  return decks.flatMap((deck) =>
    deck.cards.map((card) => ({ ...card, deckId: deck.id, deckTitle: deck.title })),
  );
}

export function nextDueDate(card: Flashcard, rating: ReviewRating) {
  const nextInterval =
    rating === "again"
      ? 0
      : rating === "hard"
        ? Math.max(1, Math.ceil(card.intervalDays * 1.4))
        : Math.max(2, Math.ceil(card.intervalDays * 2.5));

  const dueAt = new Date();
  if (rating === "again") {
    dueAt.setMinutes(dueAt.getMinutes() + 10);
  } else {
    dueAt.setDate(dueAt.getDate() + nextInterval);
  }

  return {
    dueAt: dueAt.toISOString(),
    intervalDays: nextInterval,
    reviewCount: card.reviewCount + 1,
  };
}

function seedDecks(): Deck[] {
  const now = new Date().toISOString();

  return [
    {
      id: "deck-sample",
      title: "Biology Basics",
      description: "Starter cards for practicing spaced repetition.",
      createdAt: now,
      cards: [
        {
          id: "card-cell",
          front: "What organelle is known as the powerhouse of the cell?",
          back: "The mitochondrion.",
          dueAt: now,
          intervalDays: 1,
          reviewCount: 0,
        },
        {
          id: "card-dna",
          front: "What does DNA stand for?",
          back: "Deoxyribonucleic acid.",
          dueAt: now,
          intervalDays: 1,
          reviewCount: 0,
        },
      ],
    },
  ];
}

function seedTests(): PracticeTest[] {
  const deck = seedDecks()[0];
  const cards = deck.cards;

  return [
    {
      id: "test-sample",
      title: "Biology Checkpoint",
      durationMinutes: 5,
      createdAt: new Date().toISOString(),
      questions: cards.map((card) => ({
        id: `q-${card.id}`,
        sourceCardId: card.id,
        sourceDeckId: deck.id,
        prompt: card.front,
        choices: [
          card.back,
          "I need to review this again",
          "This is not the answer",
          "None of these",
        ],
        correctAnswer: card.back,
      })),
    },
  ];
}
