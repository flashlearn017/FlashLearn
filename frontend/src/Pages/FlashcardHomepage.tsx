import { useEffect, useState } from "react";
import { supabase } from "../supabase.ts";
import type { PostgrestError } from "@supabase/supabase-js";
import type{ Json } from '../../database.types.ts';
import { useNavigate } from "react-router";


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
 
        <div className="bg-amber-400 hover:cursor-pointer" onClick={toFlashcardPage}>
            <div className="flex-col overflow-hidden text-ellipsis text-white text-3xl">
                <div>
                    {length} terms
                </div>
                <div>
                    {set_name}
                </div>
            </div>
        </div>

        

    );
}

function FlashcardHomePage() {
 const[error, setError] = useState<PostgrestError>();
    const[flashData, setFlashData] = useState<data>([]);

    
    useEffect(() => {
        //displaying all the tests the user has made 
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

            setFlashData(data)
        }
        
        fetchTest()
    }, [])



    // loading screen when fetching data
    if(typeof flashData === 'undefined'){
       return <div>loading</div>;
    }


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
        <div className="flex flex-col gap-y-2">
            {SetPreviewArr}
        </div>
    );

}

export default FlashcardHomePage;