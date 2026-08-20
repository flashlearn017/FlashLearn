import Toolbar from '../components/toolbar'
import {useState, useEffect} from "react"
import {useParams, useNavigate} from "react-router-dom";

import {supabase} from "../supabase"

export default function TestPage(){
    const {testId} = useParams();
    const [test, setTest] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchTest() {
            if(!testId){
                return;
            }

            const {data, error} = await supabase
                .from("Test")
                .select("*")
                .eq("id", testId)
                .single()
                

            if(error){
                console.log(error)
                setLoading(false)
                return;
            }    
   
            setTest(data)
            setLoading(false)
        }
        fetchTest();
    }, [testId])

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-950">
                <Toolbar />
                <div className="flex justify-center items-center min-h-screen text-2xl animate-pulse">
                    Loading test...
                </div>
            </div>
        );
    }
    
    return <Test test={test} testId={testId}/>;
}

function Test({test, testId}){
    const [answers, setAnswers] = useState({})
    const [currentTime, setTime] = useState()
    const questions = test.questions
    const timed = test.timedTest

    const navigate = useNavigate();
    
    useEffect(() => {
        if(!timed){
            return;
        }

        setTime(test.testTime*60)
        
        let interval = setInterval(() => {
            setTime(prev => {
                if(prev <= 1){
                    clearInterval(interval);
                    calculateScore();
                    return 0;
                }
                return prev-1;
            });
        },1000);

        return () => clearInterval(interval);
    }, [timed]);

    async function calculateScore(){
        let score = 0;
        let wrong = [];

        for(let i = 0; i < questions.length; i++){
            if(answers[i] == questions[i].correctChoice){
                score++;
            }else{
                wrong.push(i+1)
            }
        }

        const finalScore = Math.round(score/questions.length*100)

        const {data: {user}} = await supabase.auth.getUser();

        const {error} = await supabase.from("Test_Results").insert({
            user_id: user.id,
            test_id: testId,
            score: finalScore,
            test_name: test.name,
        })

        if(error){
            console.log(error);
            return;
        }

        navigate(
            `/results?score=${finalScore}${wrong.length > 0 ? `&wrong=${+ wrong.join(",")}` : ""}`
        )
    }

    return(
        <div>
            <Toolbar/>

            {/* printing timer */}
            {timed && (
                <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-10 py-3 shadow-sm">
                    <div className="flex justify-center items-center gap-2 text-2xl font-bold text-slate-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="flex justify-center text-3xl my-4">
                            {Math.floor(currentTime/60)}:
                            {(currentTime%60).toString().padStart(2, "0")}
                        </span>
                    </div>
                </div>
            )}

            {/* Completion Tracker */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">Progress</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                    {questions.map((question, index) =>
                        <div key={index}
                        className={"w-10 h-10 flex items-center justify-center " + (answers[index]!= undefined ? "bg-green-500 text-white" : "bg-white text-black")}>
                            {index+1} 
                        </div>
                    )}
                </div>    
            </div>

            {/* Printing the questions */}
            <div className= "my-2 flex items-center flex-col gap-10">
                {questions.map((current_question, questionIndex) => (
                    <div key={questionIndex} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold shrink-0">
                            {questionIndex+1}
                        </span>
                        <h2 className="text-xl font-medium text-slate-900 pt-1 leading-snug">
                            {current_question.question}
                        </h2>

            {/* Printing the answer choices and allowing the user to choose an answer*/}
                        <div>
                            {current_question.choices.map((choice, choiceIndex) => (
                                <div key={choiceIndex}>
                                    <input
                                        type="radio"
                                        name={"question-" + questionIndex}
                                        value={choice}
                                        onChange={() => {
                                            setAnswers((prev) => ({
                                                ...prev,
                                                [questionIndex]: choiceIndex
                                            }))
                                        }}
                                    />
                                    {" "}{choice}
                                </div>
                            ))}
                        </div>    
                    </div>
                ))}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-center mt-12">
                <button className="w-full md:w-auto bg-slate-900 text-white text-lg font-bold rounded-xl px-12 py-4 hover:bg-slate-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={calculateScore}
                >
                    Submit
                </button>
            </div>
        </div>
    )
} 