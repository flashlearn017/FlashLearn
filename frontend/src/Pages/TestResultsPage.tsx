import Toolbar from '../components/toolbar'
import {useSearchParams} from 'react-router-dom'
import {useNavigate} from 'react-router'

export default function Results(){
    return <Result/>
}

function Result(){
    const [searchParams] = useSearchParams();

    const score = searchParams.get("score");
    const wrong = searchParams.get("wrong");

    const nav = useNavigate();

    return(
        <div>
            <Toolbar/>
            <div className="flex justify-center text-5xl h-screen items-center flex-col gap-3">
                <div className="font-bold">
                    Your results:
                </div>
            
                <div className="flex justify-center text-2xl">
                    Score: {score} %
                </div>
                
                {wrong.length == 0 ? (
                    <div className="flex justify-center text-2xl">
                        You got every question right!!
                    </div>    
                ) : (
                    <div className="flex justify-center text-2xl">
                        Questions wrong: {wrong}
                    </div>
                )}

                <button className="flex justify-center text-xl bg-black text-white rounded-lg px-3 py-2 hover:bg-slate-400"
                onClick={()=>nav("/test-home")}>
                    Take a new test
                </button>

                <button className="flex justify-center text-xl bg-black text-white rounded-lg px-3 py-2 hover:bg-slate-400"
                onClick={()=>nav("/flashcards")}>
                    Review Flashcards
                </button>
            </div>
        </div>
    )
}