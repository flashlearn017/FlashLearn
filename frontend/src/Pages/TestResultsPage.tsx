import Toolbar from '../components/toolbar'
import {useSearchParams} from 'react-router-dom'
import {useNavigate} from 'react-router'

export default function Results(){
    return <Result/>
}

function Result(){
    const [searchParams] = useSearchParams();

    const score = Math.round(Number(searchParams.get("score")));
    const wrong = searchParams.get("wrong") || "";

    const navigate = useNavigate();

    return(
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
            <Toolbar/>
            <div className="max-w-2xl mx-auto px-4 mt-12 md:mt-20 text-center">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
                    <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700 mb-2">
                        Quiz Completed
                    </p>

                    <h1 className="text-4xl font-extrabold text-slate-900 mb-8">
                        Your results:
                    </h1>
                
                    <div className="inline-flex items-center justify-center bg-emerald-50 border-8 border-emerald-500/20 w-48 h-48 rounded-full mb-10 shadow-inner">
                        <span className="text-2xl font-black text-emerald-800">Score: {score} %</span>
                    </div>
                    
                    {wrong.length == 0 ? (
                        <div className="mb-10 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center gap-3">
                            You got every question right!!
                        </div>    
                    ) : (
                        <div className="mb-10 p-6 rounded-2xl text-rose-900 border border-emerald-200 flex items-center justify-center gap-3">
                            Questions wrong: {wrong}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-slate-900 text-white font-bold rounded-xl px-8 py-4 hover:bg-slate-800 transition-all shadow-md flex-1 sm:flex-none"
                        onClick={()=>navigate("/test-home")}>
                            Take a new test
                        </button>

                        <button className="border border-slate-300 bg-white font-bold text-slate-700 rounded-xl px-8 py-4 hover:bg-slate-50 transition-all flex-1 sm:flex-none"
                        onClick={()=>navigate("/flashcard")}>
                            Review Flashcards
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}