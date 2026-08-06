import Toolbar from "../components/toolbar"
import { useState } from "react"

type Card = {
    questionBody: string;
    answerBody: string;
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
                questionBody : "",
                answerBody : "",
            })
        }

        setCardDeck(newDeck);
        setCreateDeck(true);
    }

    // Creates the card deck in the backend
    function createCardDeck() {
        // Handling non Supabase errors first

        // If user didn't give deck name
        if (!cardDeckName) {
            setError("You must fill in a name for this set")
            return
        }
        
        // If user didn't fill out all parts of the cards
        for (let i = 0; i < cardDeck.length; i++) {
            if (!cardDeck[i].questionBody || !cardDeck[i].answerBody) {
                setError("All cards must have front and back filled out")
                return
            }
        }
    }

    return (
        <div>
            <Toolbar/>
            <div className="flex justify-center text-5xl my-6"> Create your Flashcards! </div>
            <div className="flex justify-center text-xl my-2">
                {/* Name of Card Deck */}
                <input 
                    type="text"
                    placeholder="Name of Set"
                    value={cardDeckName}
                    onChange={(e) => setCardDeckName(e.target.value)}
                />
                {/* Number of cards in new deck */}
                <input 
                    type="number"
                    placeholder="Number of Flashcards"
                    value={numCards}
                    onChange={(e) => setNumCards(e.target.value)}
                />
            </div>
            {/* Preview of cards in deck for user to fill */}
            <div className="flex justify-center p-4">
                <button
                    className="my-10 text-5xl bg-black text-white rounded-4xl px-3 py-2 hover:bg-slate-400 cursor-pointer"
                    onClick={previewDeck}
                >Create Flashcard(s)</button>
            </div>

            {createDeck && (<div>{
            // Displays cards in array one by one
              cardDeck.map((card, index) => (
                <div key={index} className="flex justify-center gap-6 pb-4">
                    {/* Body for the question side of card */}
                    <textarea
                        className="bg-[#8c8c8c] text-[#fffdfd] border-2 border-black w-[480px] h-60 p-3.5 text-[1.3rem]"
                        placeholder="Type question here"
                        value={card.questionBody}
                        onChange={(e) => {
                            const newQuestions: Card[] = [...cardDeck]
                            newQuestions[index].questionBody = e.target.value
                            setCardDeck(newQuestions)
                        }}
                    />
                    {/* Body for the answer side of card */}
                    <textarea
                        className="bg-[#8c8c8c] text-[#fffdfd] border-2 border-black w-[480px] h-60 p-3.5 text-[1.3rem]"
                        placeholder="Type answer here"
                        value={card.answerBody}
                        onChange={(e) => {
                            const newAnswers: Card[] = [...cardDeck]
                            newAnswers[index].answerBody = e.target.value
                            setCardDeck(newAnswers)
                        }}
                    />
                </div>
              ))  
            }
                <div className="flex justify-center p-4">
                    {/* Button for finalizing deck to backend */}
                    <button
                        className="my-10 text-5xl bg-black text-white rounded-4xl px-3 py-2 hover:bg-slate-400 cursor-pointer"
                        onClick={createCardDeck}
                    >Create Deck
                    </button>
                </div>
            </div>)}

            {/* error message */}
            {error && <p className="text-red-500 text-center">{error}</p>}

        </div>
    )
}