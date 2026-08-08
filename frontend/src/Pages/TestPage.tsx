import Toolbar from '../components/toolbar'
import {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom";

import {supabase} from "../supabase"

export default function TestPage(){
    const [test, setTest] = useState([])
    const [selectedTest, setSelected] = useState(null)

    useEffect(() => {
        //displaying all the tests the user has made 
        async function fetchTest(){
            const {
                data: {user},
            }=await supabase.auth.getUser();

            const { data, error} = await supabase
                .from("Test")
                .select("*")
                .eq("user_id", user.id)

            if(error){
                console.log(error)
                return
            }

            setTest(data)
        }
        
        fetchTest()
    }, [])

    //the user chooses a test
    if(!selectedTest){
        return(
            <div>
                <Toolbar/>
                <div className="flex justify-center items-center min-h-screen flex-col gap-4">
                    <h1 className="text-4xl text-bold"> Choose a Test to Take</h1>
                    
                    {test.map((currentTest, index) => (
                        <button
                            key={currentTest.id}
                            onClick={() => setSelected(currentTest)}
                            className="text-3xl bg-black text-white rounded-4xl px-3 py-2 hover:bg-slate-400">
                            Test{index+1}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    return <Test test={selectedTest}/>;
}

function Test({test}){
    const [answers, setAnswers] = useState({})
    const [currentTime, setTime] = useState()
    const questions = test.questions
    const timed = test.timedTest

    const navigate = useNavigate();
    
    useEffect(() => {
        console.log(timed)
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

    function calculateScore(){
        let score = 0;
        let wrong = [];

        for(let i = 0; i < questions.length; i++){
            if(answers[i] == questions[i].correctChoice){
                score++;
            }else{
                wrong.push(i+1)
            }
        }

        navigate(
            "/results?score=" + score/questions.length*100 + "&wrong=" + wrong.join(",")
        )
    }

    return(
        <div>
            <Toolbar/>

            {/* printing timer */}
            {timed && (
                <div className="flex justify-center text-3xl my-4">
                    {Math.floor(currentTime/60)}:
                    {(currentTime%60).toString().padStart(2, "0")}
                </div>
            )}

            {/* Completion Tracker */}
            <div className="flex justify-center gap-20 text-2xl border p-4">
                {questions.map((question, index) =>
                    <div key={index}
                    className={"w-10 h-10 text-center " + (answers[index] ? "bg-green-500 text-white" : "bg-white text-black")}>
                        {index+1} 
                    </div>
                )}
            </div>

            {/* Printing the questions */}
            <div className= "my-2 flex items-center flex-col gap-10">
                {questions.map((current_question, questionIndex) => (
                    <div key={questionIndex}>
                        {questionIndex+1}{". "}{current_question.question}

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
                                    {choice}
                                </div>
                            ))}
                        </div>    
                    </div>
                ))}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-center my-30">
                <button className="bg-black text-white rounded-lg px-3 py-2 hover:bg-slate-400"
                    onClick={calculateScore}
                >
                    Submit
                </button>
            </div>
        </div>
    )
} 