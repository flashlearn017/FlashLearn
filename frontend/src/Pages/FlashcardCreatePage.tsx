import Toolbar from "../components/toolbar"
import { useState } from "react"
import { supabase } from "../supabase";
import { useNavigate } from "react-router";

type Card = {
    front: string;
    back: string;
    isHard: boolean | null;
    id: string
};

export default function CreateFlashcard(){
    return <Flashcard/>
}

function Flashcard(){
    const [cardDeckName, setCardDeckName] = useState('');
    const [numCards, setNumCards] = useState('');
    const [createDeck, setCreateDeck] = useState(false);
    const [cardDeck, setCardDeck] = useState<Card[]>([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Creates a preview of the deck
    function previewDeck() {
        const count = Number(numCards);

        // Only positive amounts of cards are allowed
        if (count < 1) {
            setError('You must create at least 1 flashcard');
            return;
        }

        const newDeck = [];

        for (let i = 0; i < count; i++) {
            newDeck.push({
                front : "",
                back : "",
                isHard: null,
                id: crypto.randomUUID()
            })
        }

        setCardDeck(newDeck);
        setCreateDeck(true);
    }

    // Creates the card deck in the backend
    async function createCardDeck() {
        // Handling non Supabase errors first

        // If user didn't give deck name
        if (!cardDeckName) {
            setError("You must fill in a name for this set")
            return
        }
        
        // If user didn't fill out all parts of the cards
        for (let i = 0; i < cardDeck.length; i++) {
            if (!cardDeck[i].front || !cardDeck[i].back) {
                setError("All cards must have front and back filled out")
                return
            }
        }

        // Tries to save in Supabase
        const {error: supabaseError} = await supabase
            .from("Flashcard_Sets")
            .insert({
                set_name: cardDeckName,
                flashcards: cardDeck
            })
            .select()
            .single()

            // Handle any Supabase error
            if (supabaseError) {
                setError(supabaseError.message)
                return
            }

            // Navigate away
            navigate("/flashcard")
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950">
            <Toolbar/>

            <main className="mx-auto max-w-5xl px-4 py-10">
                <div className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">FlashLearn</p>
                    <h1 className="mt-2 text-3xl font-bold">Create your flashcards</h1>
                    <p className="mt-2 text-slate-600">Name your set and choose how many cards to fill in.</p>

                    <label className="mt-6 block">
                        <span className="text-sm font-medium text-slate-700">Name of Set</span>
                        {/* Name of Card Deck */}
                        <input
                            type="text"
                            placeholder="Name of Set"
                            value={cardDeckName}
                            onChange={(e) => setCardDeckName(e.target.value)}
                            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
                        />
                    </label>

                    <label className="mt-4 block">
                        <span className="text-sm font-medium text-slate-700">Number of Flashcards</span>
                        {/* Number of cards in new deck */}
                        <input
                            type="number"
                            placeholder="Number of Flashcards"
                            value={numCards}
                            onChange={(e) => setNumCards(e.target.value)}
                            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2"
                        />
                    </label>

                    {error && <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}

                    {/* Preview of cards in deck for user to fill */}
                    <button
                        className="mt-5 w-full rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={previewDeck}
                    >Create Flashcard(s)</button>
                </div>

                {createDeck && (<div className="mt-10">{
                // Displays cards in array one by one
                  cardDeck.map((card, index) => (
                    <div key={index} className="mb-6 flex flex-col justify-center gap-4 sm:flex-row">
                        {/* Body for the question side of card */}
                        <textarea
                            className="h-60 w-full rounded-lg border border-slate-300 bg-white p-3.5 text-[1.1rem] text-slate-950 shadow-sm transition-shadow duration-150 placeholder:text-slate-400 hover:shadow-lg focus:shadow-lg focus:outline-none sm:w-[480px]"
                            placeholder="Type question here"
                            value={card.front}
                            onChange={(e) => {
                                const newQuestions: Card[] = [...cardDeck]
                                newQuestions[index].front = e.target.value
                                setCardDeck(newQuestions)
                            }}
                        />
                        {/* Body for the answer side of card */}
                        <textarea
                            className="h-60 w-full rounded-lg border border-slate-300 bg-white p-3.5 text-[1.1rem] text-slate-950 shadow-sm transition-shadow duration-150 placeholder:text-slate-400 hover:shadow-lg focus:shadow-lg focus:outline-none sm:w-[480px]"
                            placeholder="Type answer here"
                            value={card.back}
                            onChange={(e) => {
                                const newAnswers: Card[] = [...cardDeck]
                                newAnswers[index].back = e.target.value
                                setCardDeck(newAnswers)
                            }}
                        />
                    </div>
                  ))
                }
                    <div className="mx-auto flex max-w-md justify-center pb-10">
                        {/* Button for finalizing deck to backend */}
                        <button
                            className="w-full rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                            onClick={createCardDeck}
                        >Create Deck
                        </button>
                    </div>
                </div>)}
            </main>
        </div>
    )
}