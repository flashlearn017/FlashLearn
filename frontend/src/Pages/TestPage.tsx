import Toolbar from '../components/toolbar'
import {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom";

export default function TestPage(){
    return <Test/>;
}

function Test(){
    const [answers, setAnswers] = useState({})
    const [currentTime, setTime] = useState()
    const [questions, setQuestions] = useState([])
    const [timed, setTimed] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        const storedTest = localStorage.getItem("currentTest")

        if (storedTest) {
            const test = JSON.parse(storedTest);

            const formattedQuestions = test.questions.map((q, index) => ({
                id: index + 1,
                question: q.question,
                answerChoices: q.choices,
                correctAnswer: q.choices[q.correctChoice]
            }));

            setQuestions(formattedQuestions);

            if (test.timedTest) {
                setTime(Number(test.testTime) * 60);
                setTimed(true)
            }
        }
    }, []);

    
    useEffect(() => {
        if(!timed){
            return;
        }
        
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
    }, []);

    function calculateScore(){
        let score = 0;
        let wrong = [];

        for(let i = 0; i < questions.length; i++){
            if(answers[questions[i].id] == questions[i].correctAnswer){
                score++;
            }else{
                wrong.push(questions[i].id)
            }
        }

        navigate(
            "/results?score=" + score/questions.length*100 + "&wrong=" + wrong.join(",")
        )
    }

    return(
        <div>
            <Toolbar/>

            {/* Timer */}
            {timed && (
                <div className="flex justify-center text-3xl my-4">
                    {Math.floor(currentTime/60)}:
                    {(currentTime%60).toString().padStart(2, "0")}
                </div>
            )}

            {/* Completion Tracker */}
            <div className="flex justify-center gap-20 text-2xl border p-4">
                {questions.map((question) =>
                    <div key={question.id}
                    className={"w-10 h-10 text-center " + (answers[question.id] ? "bg-green-500 text-white" : "bg-white text-black")}>
                        {question.id} 
                    </div>
                )}
            </div>

            {/* Printing the questions */}
            <div className= "my-2 flex items-center flex-col gap-10">
                {questions.map((current_question, i) => (
                    <div key={i}>
                        {i+1}{". "}{current_question.question}

            {/* Printing the answer choices and allowing the user to choose an answer*/}
                        <div>
                            {current_question.answerChoices.map((choice,j) => (
                                <div key={j}>
                                    <input
                                        type="radio"
                                        name={"question-" + current_question.id}
                                        value={choice}
                                        onChange={(event) => {
                                            setAnswers((prev) => ({
                                                ...prev,
                                                [current_question.id]: event.target.value
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