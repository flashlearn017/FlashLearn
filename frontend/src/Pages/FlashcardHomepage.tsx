import { useEffect, useState } from "react";
import { supabase } from "../supabase.ts";
import type { PostgrestError } from "@supabase/supabase-js";
import type{ Json } from '../../database.types.ts';
import { useNavigate } from "react-router";
import Toolbar from "../components/toolbar.tsx";
import { PulseLoader } from "react-spinners";
type Flashcard = {
    front:string
    back:string
    isHard: boolean | null; 
    id: string;
}


type data= {
    id: number;
    set_name: string | null;
    flashcards: Json;
}[]


type thisUserFlashData= {
    id: number;
    set_name: string | null;
    flashcards: Json;
}[];


type SetPreviewProp = {
    flashSet: flashSet;
    set_name: string;
    length: number;
}
type flashSet= {
    id: number;
    set_name: string| null;
    flashcards: Json;
}



function SetPreviewComponent({length, set_name,flashSet }: SetPreviewProp){
    const nativateTo = useNavigate();
  
    const toFlashcardPage = () =>{
        nativateTo('/flashcard',{state: flashSet})
    }
    return(

        <div className="bg-emerald-800 p-[0.85rem] border-emerald-800 hover:cursor-pointer hover:bg-emerald-900 hover:border-b-emerald-500 hover: border-b-8 rounded-xl" onClick={toFlashcardPage}>
            <div className="flex-col overflow-hidden text-ellipsis text-white">
                
                <div className="font-medium">
                    {length} terms
                </div>
                <div className="font-semibold">
                    {set_name}
                </div>
            </div>
        </div>
    
       

        

    );
}

function FlashcardHomePage() {
 const[error, setError] = useState<PostgrestError>();
    const[flashData, setFlashData] = useState<data>([]);
    const[isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        async function fetchTest(){
            
            const {
                data: {user},
            }=await supabase.auth.getUser();

            if(!user){
                console.error("ERROR RETRIEVING USER: ", user);
                return;
            }

            const { data, error} = await supabase
                .from("Flashcard_Sets")
                .select("id, set_name, flashcards")
                .eq("user_id", user.id);
            

            if(error){
                console.error("ERROR IN FETCHING DATA: ",error);
                return;
            }
            setIsLoading(false)
            setFlashData(data)
        }
        
        fetchTest()
    }, [])



    // loading screen when fetching data
    if(isLoading){
        return(
            <div className="flex justify-center h-screen place-items-center  ">
               
                <PulseLoader/>
            </div>
            
        )
    }


    // array to store preview of each flash set 
    const SetPreviewArr = flashData.map((flashSet)=>{
        const flashcardsArr = flashSet.flashcards as Flashcard[]
        const flashSetName = flashSet.set_name as string;
        return(
            <SetPreviewComponent 
                flashSet={flashSet}
                length={ flashcardsArr.length }
                set_name={flashSetName}               
            />
            
        );
    })

    return(
        <>
            
            
             <header>
                <nav>
                    <Toolbar/>
                </nav>
                <div className="font-bold text-4xl p-[0.85rem] ">
                    Your Sets
                </div>
                
            </header>
            <div className="flex flex-col gap-y-2 m-2">
                {SetPreviewArr}
            </div>
        </>
       
    );

}

export default FlashcardHomePage;