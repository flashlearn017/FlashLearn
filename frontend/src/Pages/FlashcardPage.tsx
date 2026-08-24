import {useEffect, useState} from 'react'
import Sidebar from '../components/assets/Sidebar/Sidebar.tsx';
import Navbar from '../components/assets/Navbar/Navigationbar.tsx';
import RightArrowIcon from '../components/assets/svg-icons/RightArrowIcon.tsx';
import LeftArrowIcon from '../components/assets/svg-icons/LeftArrowIcon.tsx';
import { supabase } from '../supabase.ts';
import { PostgrestError } from '@supabase/supabase-js';
//import type{ Tables, Database, Json } from '../../database.types.ts';
import { useNavigate } from "react-router";
import Toolbar from "../components/toolbar"

export default function CardDisplayPage() {
    return <CardDisplay/>
}

{/* defining prop type to pass into FlipCardComponent*/}
interface FlipCardObject {
    frontContent: string;
    backContent: string;
    isHard: boolean | null; 
    id: string;
    isFlipped: boolean;
    setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
};

{/* defining prop type to pass into SelectDifficultyButton*/}
interface SelectDifficultyButtonProps {
  cardId: string;
  currentFlashcards: Flashcard[];
  setId: string;
  setSelected: React.Dispatch<React.SetStateAction<flashCardData | null>>;
}

function shuffleCards(array: Flashcard[]) {
    const shuffled =[...array];
    let currentIndex = shuffled.length;
    
    while(currentIndex > 0){
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    

    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
    }

    return shuffled;
}

async function saveDifficulty(
    hard: boolean,
    cardId: string,
    currentFlashcards: Flashcard[],
    setId: string,
    setSelected: React.Dispatch<React.SetStateAction<flashCardData | null>>
){
    const newFlashcards = currentFlashcards.map((card) => {
        if(card.id == cardId){
            return{...card, isHard: hard}
        }
        return card
    });

    // Update Supabse
    const { data, error } = await supabase
        .from('Flashcard_Sets')
        .update({flashcards: newFlashcards})
        .eq('id', setId)
        .select()

    if (error) {console.log(error.message); return}

    // Update local state with the difficulty change
    setSelected(prev => prev ? {...prev, flashcards: newFlashcards} : prev);
}

function SelectDifficultyButton({cardId, currentFlashcards, setId, setSelected}: SelectDifficultyButtonProps){
    return(
        <>
            <div className='inline-flex flex-row gap-4 items-center m-18 '>
                <button className='bg-green-400 text-3xl px-6 py-3 rounded-full hover:opacity-75 cursor-pointer'
                onClick={()=> (saveDifficulty(false, cardId, currentFlashcards, setId, setSelected))}>
                Easy
                </button>
                <button className='bg-red-400 text-3xl px-6 py-3 rounded-full hover:opacity-75 cursor-pointer'
                onClick={()=> (saveDifficulty(true, cardId, currentFlashcards, setId, setSelected))}>
                Hard
                </button>

            </div>
        </>
    );
}

{/* user finished reviewing the flashcard set */}
function completedDeck(flashcards: Flashcard[]) {

    // Sort each card into 3 arrays based on difficulty
    const hardArray: Flashcard[] = [];
    const medArray: Flashcard[] = []; // null acts as medium
    const easyArray: Flashcard[] = [];

    for (let i = 0; i < flashcards.length; i++) {
        if (flashcards[i].isHard === true) {
            hardArray.push(flashcards[i]);
        } else if (flashcards[i].isHard === false) {
            easyArray.push(flashcards[i]);
        } else {medArray.push(flashcards[i]);}
    }

    // Merge back into one array
    const sortedDiffArray = [...hardArray, ...medArray, ...easyArray];

    // Shuffle cards in each diff
    shuffleCards(sortedDiffArray);

    // Navigate back to flashcard-home or results page
}

{/*Generate a flip card from given front and back data */}
function FlipCardComponent({frontContent, backContent, isHard, isFlipped, setIsFlipped}: FlipCardObject){
     return (
   
        <div className={` h-80 w-70 cursor-pointer  rounded-lg justify-center items-center flex flex-col
                                ${
                                    isHard === true? "border-2 border-orange-100": "border-2 border-green-100"
                                }
                                ${isFlipped? "bg-red-500": "bg-blue-500" }
                                transition-transform duration-400 ${isFlipped? " transform-[rotateY(180deg)]":""}`}              
                    onClick={()=>{setIsFlipped(!isFlipped)}}> 

                        {/*card-content */}

                        {!isFlipped ? 
                            // Front side of card
                            <div className="text-center text-bold text-white text-xl m-2 w-5/6 wrap-anywhere " >
                                {frontContent}
                            </div> 
                            
                            : 
                            
                            // Back side of card
                            <div className= "text-center text-bold text-white text-xl transform-[rotateY(180deg)] m-2 wrap-anywhere">
                                    {backContent}
                            </div>
                        }
        </div>

 
    );
}

type Flashcard = {
    front:string
    back:string
    isHard: boolean | null; 
    id: string;
}

type Data = {
    id: string
    set_name: string
    flashcards: Flashcard[];
}[]

interface flashCardData {
    id: string
    set_name: string
    flashcards: Flashcard[];
}

function CardDisplay() {

    const[count,setCount] = useState(1);
    const[flashData, setFlashData] = useState<Data>([]);
    const[selectedFlash, setSelected] = useState<flashCardData | null>(null)
    const[error, setError] = useState<PostgrestError>();
    const[finishedDeck, setFinished] = useState(false);
    const[onFlip, setOnFlip] = useState(false);

    const navigate = useNavigate();
    
    useEffect(() => {
        async function fetchFlash(){
            const {
                data: {user},
            }=await supabase.auth.getUser();

            if(!user){
                console.log("ERROR RETRIEVING USER: ", user);
                return;
            }

            const { data, error} = await supabase
                .from("Flashcard_Sets")
                .select("id, set_name, flashcards")
                .eq("user_id", user.id)
            

            if(error){
                console.log(error)
                return
            }
            if(!data){
            }
            setFlashData(data as Data)
        }
        
        fetchFlash()
    }, [])

    // Reset the flip state whenever the displayed card changes
    useEffect(() => {
        setOnFlip(false);
    }, [count])

    if(!selectedFlash){
        return(
            <div>
                <Toolbar/>
                <div className="flex justify-center items-center min-h-screen flex-col gap-4">
                    <div className="text-5xl flex justify-center"> What would you like to do today? </div>
                    <button className="text-5xl bg-black text-white rounded-4xl px-3 py-2 hover:bg-slate-400" 
                        onClick={()=> navigate("/create-flashcard")}>
                        Create Flashcard 
                    </button>
                    <div className="text-5xl flex justify-center"> or </div>
                    <h1 className="text-4xl text-bold"> Choose a Set to Take</h1>
                        {flashData.map((currentFlash) => (
                        <button
                            key={currentFlash.id}
                            onClick={() =>
                            setSelected({
                                ...currentFlash,
                                flashcards: shuffleCards(currentFlash.flashcards)
                            })
                        }
                            className="text-3xl bg-black text-white rounded-4xl px-3 py-2 hover:bg-slate-400">
                            {currentFlash.set_name}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    
    const FlipCardsArr  =
        selectedFlash.flashcards.map((card: Flashcard) => {
            return(
            <FlipCardComponent
                frontContent={card.front}
                backContent={card.back}
                isHard={card.isHard}
                id={card.id}
                isFlipped={onFlip}
                setIsFlipped={setOnFlip}
            />
            )
        })
        
    const totalFlipCards = FlipCardsArr?.length;

    if (finishedDeck) {
        return (
            <div className='grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] min-h-screen gap-x-1 border-2'>
                <Navbar />
                <Sidebar />

                <div className="flex flex-col justify-center items-center gap-2">

                    {/* button to end flashcard session */}
                    <button className="text-2xl bg-black text-white rounded-4xl px-6 py-3 hover:bg-slate-400 cursor-pointer transition-colors"
                        onClick={()=>{completedDeck(selectedFlash.flashcards)}}
                    >End Review Session</button>

                    <div className="flex flex-row gap-2">
                        <div onClick={()=>{setCount(count != 1 ? count=>count-1: count=>count); setFinished(false);}}>
                            <LeftArrowIcon />    
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className='grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] min-h-screen gap-x-1 border-2'>
            <Navbar />
            <Sidebar />

            <div className="relative flex flex-row items-center justify-center">
            {onFlip && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2">
                    <SelectDifficultyButton cardId={selectedFlash.flashcards[count-1].id} currentFlashcards={selectedFlash.flashcards} setId={selectedFlash.id} setSelected={setSelected}/>
                </div>
            )}

            <div className="flex flex-col justify-center items-center gap-2">
                
                {FlipCardsArr.length > 0 ? FlipCardsArr[count-1] :<div>Make a flashcard</div>}

                <div className="flex flex-row gap-2">

                    <div onClick={()=>{setCount(count != 1 ? count=>count-1: count=>count)}}>
                        <LeftArrowIcon />    
                    </div>

                    <div className="bg-gray-400 text-bold text-white text-xl rounded-lg px-4 py-0.75">{count + " / " + totalFlipCards}</div>
                    
                    <div 
                        
                        onClick={()=>{setCount(count < totalFlipCards ? count=> count+1 : count=>count); (count == totalFlipCards) && setFinished(true);}}>
                        <RightArrowIcon />
                    </div>

                </div>
            </div>
            </div>
        </div>
    );
}