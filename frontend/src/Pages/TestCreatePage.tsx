import Toolbar from "../components/toolbar"
import SettingImg from "../assets/setting.webp"

import {useState} from "react"

export default function CreateTestPage(){
    const [testName, setTestName] = useState("");
    const [numQuestions, setNumQuestions] = useState("");
    const [timedTest, setTimedTest] = useState(false)
    const [testTime, setTestTime] = useState("");
    const [questions, setQuestions] = useState([]);
    const [showSetting, setShowSetting] = useState(true)

    return (
        <div>
            <Toolbar/>
            <div className="flex justify-center text-5xl my-4"> Create {testName || "your Test"} </div>
            <div className="flex justify-center">
                <button
                onClick={()=> setShowSetting(!showSetting)}
                className="text-3xl bg-black text-white rounded-4xl px-3 py-2 hover:bg-slate-400"
                >
                    {showSetting ? "Hide Settings" : "Show Settings"}
                </button>
            </div>
            {showSetting && (
            <Setting
                testName={testName}
                setTestName={setTestName}
                numQuestions={numQuestions}
                setNumQuestions={setNumQuestions}
                timedTest={timedTest}
                setTimedTest={setTimedTest}
                testTime={testTime}
                setTestTime={setTestTime}
                setQuestions={setQuestions}
            />
            )}
            {questions.length > 0 && (
            <Create
                timedTest={timedTest}
                testTime={testTime}
                questions={questions}
                setQuestions={setQuestions}
            />
            )}
        </div>
    )
}

function Setting({
    testName,
    setTestName,
    numQuestions,
    setNumQuestions,
    timedTest,
    setTimedTest,
    testTime,
    setTestTime,
    setQuestions,
    }){
    function createQuestions(){
        const count = Number(numQuestions)

        if(timedTest && testTime < 1){
            alert("Must enter a time!!")
            return;
        }

        const newQuestions = [];

        for(let i = 0; i < count; i++){
            newQuestions.push({
                question : "",
                correctChoice : 0,
                choices : ["", "", "", ""],
            })
        }

        setQuestions(newQuestions);
    }
    return(
        <div className="max-w-4xl mx-auto mt-5 bg-gray-400 shadow-lg rounded-xl p-8">
            <div className="flex justify-center items-center flex-col text-xl gap-1">
                <div className="text-2xl">
                    Settings 
                </div>
                <input
                    type="text"
                    placeholder="Name of this Test"
                    value={testName}
                    onChange={(e) =>setTestName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Number of Questions"
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

                <button
                onClick={createQuestions}
                className="my-10 text-3xl bg-black text-white rounded-4xl px-3 py-2 hover:bg-slate-400">
                    Update Settings
                </button>
            </div>
        </div>
    )
}

function Create({
    timedTest,
    testTime,
    questions,
    setQuestions,
    }){

    function createTest(){
        if(questions.length == 0){
            alert("Create Questions First!")
            return;
        }

        if(timedTest){
            if(testTime <= 0){
                alert("Amount of time must be positive and greater than 0")
                return;
            }
        }

        if(questions.some(question=> question.choices.some(choice=>choice.trim() == ""))){
            alert("All answer choices must be filled out")
            return;
        }
    }

    return(
        <div className="max-w-4xl mx-auto mt-10 bg-gray-400 shadow-lg rounded-xl p-8">
            <div className="flex justify-center items-center flex-col text-xl gap-1">
            </div>

            <div className="text-2xl flex flex-col items-center">
                {questions.map((q,index) => (
                    <div key={index} className="mb-4">
                        <div>
                            Question {index + 1}
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Enter Question"
                                value={q.question}
                                onChange={(e)=>{
                                    const newQuestion = [...questions]
                                    newQuestion[index].question = e.target.value
                                    setQuestions(newQuestion)
                                }}>
                            </input>
                        </div>
                        
                        {q.choices.map((choice, choiceIndex) => (
                            <div key={choiceIndex}>
                                <input
                                    type="radio"
                                    name={`question-${index}`}
                                    checked={q.correctChoice==choiceIndex}
                                    onChange={() => {
                                        const newQuestions = [...questions]
                                        newQuestions[index].correctChoice = choiceIndex
                                        setQuestions(newQuestions)
                                    }}
                                />

                                <input
                                    type="text"
                                    placeholder={`Answer ${choiceIndex+1}`}
                                    value={choice}
                                    onChange = {(e) => {
                                        const newQuestions = [...questions]
                                        newQuestions[index].choices[choiceIndex] = e.target.value
                                        setQuestions(newQuestions)
                                    }}
                                />

                            </div>    
                        ))}
                    </div>
                ))}

                {questions.length > 0 && (
                <button
                onClick={createTest}
                className="my-10 text-3xl bg-black text-white rounded-4xl px-3 py-2 hover:bg-slate-400">
                    Create Test
                </button>
                )}
            </div>
        </div>
    )
}