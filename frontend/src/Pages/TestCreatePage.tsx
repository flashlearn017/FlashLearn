import Toolbar from "../components/toolbar"

import {useState} from "react"

export default function CreateTestPage(){
    return <Create/>
}

function Create(){
    const [numQuestions, setNumQuestions] = useState("");
    const [timedTest, setTimedTest] = useState(false)
    const [testTime, setTestTime] = useState("")
    const [questions, setQuestions] = useState([])

    function createQuestions(){
        const count = Number(numQuestions)

        const newQuestions = [];

        for(let i = 0; i < count; i++){
            newQuestions.push({
                question : "",
                answer : "",
                choices : ["", "", "", ""],
            })
        }

        setQuestions(newQuestions);
    }

    return(
        <div>
            <Toolbar/>
            <div className="flex justify-center text-5xl my-4"> Create your test </div>
            <div className="flex justify-center items-center flex-col text-xl gap-1">
                <input
                type="number"
                placeholder="Number of questions"
                value={numQuestions}
                onChange={(e)=>setNumQuestions(e.target.value)}
                />

                <div>
                    <label> Do you want this test to be timed? </label>
                    <input
                    type="checkbox"
                    checked={timedTest}
                    onChange={(e)=>{setTimedTest(e.target.checked)}}
                    />
                </div>

                {timedTest &&(
                    <input
                    type="number"
                    placeholder="Test Time in Minutes"
                    value={testTime}
                    onChange={(e)=>{setTestTime(e.target.value)}}
                    />
                )}

                {/* Eventually I'll only show the create questions if they filled everything above */}
                <button
                onClick={createQuestions}
                className="my-10 text-5xl bg-black text-white rounded-4xl px-3 py-2 hover:bg-slate-400">
                    Create Questions
                </button>
            </div>

            <div className="text-2xl flex flex-col items-center">
                {questions.map((q,index) => (
                    <div key={index} className="mb-4">
                        <div>
                            Question {index + 1}
                        </div>

                        <input
                        type="text"
                        placeholder="Enter Question"
                        value={q.question}
                        onChange={(e)=>{

                        }}>

                        </input>
                    </div>
                ))}
            </div>

        </div>
    )
}