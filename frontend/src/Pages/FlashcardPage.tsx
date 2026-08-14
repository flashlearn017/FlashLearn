import {useEffect, useState} from 'react'
import Sidebar from '../components/assets/Sidebar/Sidebar.tsx';
import Navbar from '../components/assets/Navbar/Navigationbar.tsx';
import RightArrowIcon from '../components/assets/svg-icons/RightArrowIcon.tsx';
import LeftArrowIcon from '../components/assets/svg-icons/LeftArrowIcon.tsx';
import { supabase } from '../supabase.ts';
import { PostgrestError } from '@supabase/supabase-js';
import type{ Tables, Database, Json } from '../../database.types.ts';
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
};

// To be implemented
// function shuffleCards {
//     return;
// }

async function saveDifficulty(hard: boolean | null){
    const { data, error } = await supabase
        .from('Flashcards_set')
        .update({ isHard: true })
        .eq('id', card.id)
        .select()
}

async function SelectDifficultyButton(){
    const [hard, setHard] = useState<boolean | null>()
    return(
        <div className='inline-flex flex-row gap-4 items-center'>
            <button className='bg-green-100'
            onClick={()=> setHard(false)}> 
            Easy
             </button>    
            <button className='bg-red-100'
            onClick={()=> setHard(true)}> 
            Hard
            </button>

            <div>{saveDifficulty(hard)}</div>
        </div>
    );
}

{/*Generate a flip card from given front and back data */}
function FlipCardComponent({frontContent, backContent, isHard}: FlipCardObject){
     const[isFlipped, setIsFlipped] = useState(false);
     const[checkedIsHard, setIsHard] = useState(null);
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

function CardDisplay() {

    const[count,setCount] = useState(1);
    const[flashData, setFlashData] = useState<Data>([]);
    const[selectedFlash, setSelected] = useState(null)
    const[error, setError] = useState<PostgrestError>();
    const navigate = useNavigate();
    
    useEffect(() => {
        async function fetchTest(){
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
        
        fetchTest()
    }, [])

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
                            onClick={() => setSelected(currentFlash)}
                            className="text-3xl bg-black text-white rounded-4xl px-3 py-2 hover:bg-slate-400">
                            {currentFlash.set_name}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    const FlipCardsArr  = 
    // .filter((card: Flashcard) => card.isHard)
        selectedFlash.flashcards.map((card: Flashcard) => {
            return(
            <FlipCardComponent
                frontContent={card.front}
                backContent={card.back}
                isHard={card.isHard}
            />
            )
        })
        

    const totalFlipCards = FlipCardsArr?.length;

    return (
        <div className='grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] min-h-screen gap-x-1 border-2'>
            <Navbar />
            <Sidebar />

            <div className="flex flex-row items-center">
            <SelectDifficultyButton />
          
            <div className="flex flex-col justify-center items-center gap-2">
                
                {FlipCardsArr.length > 0 ? FlipCardsArr[count-1]:<div>Make a flashcard</div>}

                <div className="flex flex-row gap-2">

                    <div onClick={()=>{setCount(count != 1 ? count=>count-1: count=>count)}}>
                        <LeftArrowIcon />    
                    </div>

                    <div className="bg-gray-400 text-bold text-white text-xl rounded-lg px-4 py-0.75">{count + " / " + totalFlipCards}</div>
                    
                    <div 
                        
                        onClick={()=>{setCount(count < totalFlipCards ? count=> count+1 : count=>count)}}>
                        <RightArrowIcon />
                    </div>
                    
                </div>
            </div>
            </div>
        </div>
    );
}