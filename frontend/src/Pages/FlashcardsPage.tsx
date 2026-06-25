import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Toolbar from "../components/toolbar";
import { getDecks, makeId, saveDecks } from "../lib/flashlearn";
import type { Deck, Flashcard } from "../lib/flashlearn";

export default function FlashcardsPage() {
  const [decks, setDecks] = useState(() => getDecks());
  const [selectedDeckId, setSelectedDeckId] = useState(() => getDecks()[0]?.id ?? "");
  const [deckTitle, setDeckTitle] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [error, setError] = useState("");

  const selectedDeck = useMemo(
    () => decks.find((deck) => deck.id === selectedDeckId) ?? decks[0],
    [decks, selectedDeckId],
  );
  const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);

  function persist(nextDecks: Deck[]) {
    setDecks(nextDecks);
    saveDecks(nextDecks);
  }

  function createDeck(event: FormEvent) {
    event.preventDefault();
    const cleanTitle = deckTitle.trim();

    if (!cleanTitle) {
      setError("Add a deck title.");
      return;
    }

    const deck: Deck = {
      id: makeId("deck"),
      title: cleanTitle,
      description: deckDescription.trim(),
      createdAt: new Date().toISOString(),
      cards: [],
    };

    persist([deck, ...decks]);
    setSelectedDeckId(deck.id);
    setDeckTitle("");
    setDeckDescription("");
    setError("");
  }

  function addCard(event: FormEvent) {
    event.preventDefault();

    if (!selectedDeck) {
      setError("Create a deck before adding cards.");
      return;
    }

    const cleanFront = front.trim();
    const cleanBack = back.trim();

    if (!cleanFront || !cleanBack) {
      setError("Add both sides of the flashcard.");
      return;
    }

    const card: Flashcard = {
      id: makeId("card"),
      front: cleanFront,
      back: cleanBack,
      dueAt: new Date().toISOString(),
      intervalDays: 1,
      reviewCount: 0,
    };

    const nextDecks = decks.map((deck) =>
      deck.id === selectedDeck.id ? { ...deck, cards: [card, ...deck.cards] } : deck,
    );

    persist(nextDecks);
    setFront("");
    setBack("");
    setError("");
  }

  function deleteCard(deckId: string, cardId: string) {
    const nextDecks = decks.map((deck) =>
      deck.id === deckId
        ? { ...deck, cards: deck.cards.filter((card) => card.id !== cardId) }
        : deck,
    );
    persist(nextDecks);
  }

  function deleteDeck(deckId: string) {
    const nextDecks = decks.filter((deck) => deck.id !== deckId);
    persist(nextDecks);
    setSelectedDeckId(nextDecks[0]?.id ?? "");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Toolbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Flashcards</p>
            <h1 className="mt-1 text-3xl font-bold">Create and manage decks</h1>
            <p className="mt-2 text-sm text-slate-600">
              Build cards here, then use the review page when you are ready to study.
            </p>
          </div>
          <Link to="/review-flashcards" className="rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800">
            Review cards
          </Link>
        </div>

        {error && <p className="mt-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">{error}</p>}

        <section className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-5">
            <form onSubmit={createDeck} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold">New deck</h2>
              <label className="mt-4 block">
                <span className="text-sm font-medium text-slate-700">Title</span>
                <input value={deckTitle} onChange={(event) => setDeckTitle(event.target.value)} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="World history" />
              </label>
              <label className="mt-4 block">
                <span className="text-sm font-medium text-slate-700">Description</span>
                <textarea value={deckDescription} onChange={(event) => setDeckDescription(event.target.value)} className="mt-2 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Optional notes for this deck" />
              </label>
              <button type="submit" className="mt-4 w-full rounded-md bg-slate-950 px-4 py-3 font-semibold text-white hover:bg-slate-700">
                Create deck
              </button>
            </form>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">Decks</h2>
                <span className="text-sm text-slate-600">{totalCards} cards</span>
              </div>
              <div className="mt-4 space-y-2">
                {decks.length === 0 ? (
                  <p className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-600">Create your first deck to add flashcards.</p>
                ) : decks.map((deck) => (
                  <button
                    key={deck.id}
                    type="button"
                    onClick={() => setSelectedDeckId(deck.id)}
                    className={`w-full rounded-md border p-3 text-left transition ${
                      selectedDeck?.id === deck.id
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span className="block font-semibold">{deck.title}</span>
                    <span className="mt-1 block text-sm text-slate-600">{deck.cards.length} cards</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            {selectedDeck ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{selectedDeck.title}</h2>
                    <p className="mt-1 text-sm text-slate-600">{selectedDeck.description || "No description"}</p>
                  </div>
                  <button type="button" onClick={() => deleteDeck(selectedDeck.id)} className="rounded-md border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">
                    Delete deck
                  </button>
                </div>

                <form onSubmit={addCard} className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-lg font-semibold">Add card</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">Front</span>
                      <textarea value={front} onChange={(event) => setFront(event.target.value)} className="mt-2 min-h-28 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Question or prompt" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">Back</span>
                      <textarea value={back} onChange={(event) => setBack(event.target.value)} className="mt-2 min-h-28 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Answer" />
                    </label>
                  </div>
                  <button type="submit" className="mt-4 rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800">
                    Add card
                  </button>
                </form>

                <div className="mt-5 space-y-3">
                  {selectedDeck.cards.length === 0 ? (
                    <p className="rounded-md border border-dashed border-slate-300 p-5 text-center text-slate-600">No cards in this deck yet.</p>
                  ) : selectedDeck.cards.map((card) => (
                    <article key={card.id} className="rounded-md border border-slate-200 p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Front</p>
                          <p className="mt-1 whitespace-pre-wrap">{card.front}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Back</p>
                          <p className="mt-1 whitespace-pre-wrap">{card.back}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
                        <span>Reviewed {card.reviewCount} times</span>
                        <button type="button" onClick={() => deleteCard(selectedDeck.id, card.id)} className="rounded-md border border-rose-200 px-3 py-2 font-semibold text-rose-700 hover:bg-rose-50">
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
                <h2 className="text-xl font-semibold">No deck selected</h2>
                <p className="mt-2 text-slate-600">Create a deck to start adding flashcards.</p>
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
