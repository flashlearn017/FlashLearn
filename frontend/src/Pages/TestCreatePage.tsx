import Toolbar from "../components/toolbar"
import SettingImg from "../assets/setting.webp"

import { useState } from "react"
import { useNavigate } from "react-router-dom";

import { supabase } from "../supabase"

export default function CreateTestPage() {
    const [testName, setTestName] = useState("");
    const [numQuestions, setNumQuestions] = useState("");
    const [timedTest, setTimedTest] = useState(false)
    const [testTime, setTestTime] = useState("");
    const [questions, setQuestions] = useState([]);
    const [showSetting, setShowSetting] = useState(true)

    return (
        <div>
            <Toolbar />
            <div className="text-3xl font-bold text-slate-900 mt-1 flex justify-center"> Create {testName || "your Test"} </div>
            <div className="flex justify-center">
                <button
                    onClick={() => setShowSetting(!showSetting)}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-100 transition-all shadow-sm my-5"
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
                    setShowSetting={setShowSetting}
                />
            )}
            {questions.length > 0 && (
                <Create
                    testName={testName}
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
    setShowSetting,
}) {
    function updateSettings() {
        const count = Number(numQuestions)

        if (testName.trim() == "") {
            alert("Must have a test name!!")
            return;
        }

        if (Number(numQuestions) <= 0) {
            alert("Must have at least 1 question!")
            return;
        }

        if (timedTest && testTime < 1) {
            alert("Must enter a time!!")
            return;
        }

        const newQuestions = [];

        for (let i = 0; i < count; i++) {
            newQuestions.push({
                question: "",
                correctChoice: 0,
                choices: ["", "", "", ""],
            })
        }

        setQuestions(newQuestions);
        setShowSetting(false);
    }
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">
                Settings
            </h2>

            <label className="block text-sm font-medium text-slate-700 mb-1">Test Name</label>
            <input
                type="text"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Name of this Test"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
            />

            <label className="block text-sm font-medium text-slate-700 mb-1">Number of Questions</label>
            <input
                type="number"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Number of Questions"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
            />

            <div className="pt-2 pb-2">
                <label className="flex items-center gap-3 cursor-pointer"> Do you want this test to be timed?
                    <input
                        type="checkbox"
                        className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                        checked={timedTest}
                        onChange={(e) => { setTimedTest(e.target.checked) }}
                    />
                </label>
            </div>

            {timedTest && (
                <div className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Time Limit</label>
                    <input
                        type="number"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Test Time in Minutes"
                        value={testTime}
                        onChange={(e) => { setTestTime(e.target.value) }}
                    />
                </div>
            )}

            <button
                onClick={updateSettings}
                className="w-full bg-slate-900 text-white font-bold rounded-xl px-6 py-4 hover:bg-slate-800 transition-all shadow-md">
                Update Settings
            </button>
        </div>
    )
}

function Create({
    testName,
    timedTest,
    testTime,
    questions,
    setQuestions,
}) {

    const navigate = useNavigate();

    async function createTest() {
        const {
            data: { user },
        } = await supabase.auth.getUser();


        if (questions.some(question => question.question.trim() == "")) {
            alert("Create Questions First!")
            return;
        }

        if (timedTest) {
            if (testTime <= 0) {
                alert("Amount of time must be positive and greater than 0")
                return;
            }
        }

        if (questions.some(question => question.choices.some(choice => choice.trim() == ""))) {
            alert("All answer choices must be filled out")
            return;
        }

        const { error } = await supabase
            .from("Test")
            .insert([
                {
                    user_id: user.id,
                    name: testName,
                    timedTest: timedTest,
                    testTime: testTime ? Number(testTime) : null,
                    questions: questions
                }
            ])
            .select();

        if (error) {
            console.log(error)
            return;
        }

        navigate("/test-home")
    }

    return (
        <div className="mt-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-2xl font-bold text-slate-800"> Fill Out Questions</h2>
            </div>


            {questions.map((q, index) => (
                <div key={index} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex gap-4 items-start mb-6">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold shrink-0 mt-1">
                            {index + 1}
                        </span>

                        <div>
                            <input
                                type="text"
                                placeholder="Enter Question"
                                value={q.question}
                                onChange={(e) => {
                                    const newQuestion = [...questions]
                                    newQuestion[index].question = e.target.value
                                    setQuestions(newQuestion)
                                }}>
                            </input>
                        </div>
                    </div>

                    {q.choices.map((choice, choiceIndex) => (
                        <div key={choiceIndex}>
                            <input
                                type="radio"
                                name={`question-${index}`}
                                checked={q.correctChoice == choiceIndex}
                                onChange={() => {
                                    const newQuestions = [...questions]
                                    newQuestions[index].correctChoice = choiceIndex
                                    setQuestions(newQuestions)
                                }}
                            />

                            <input
                                type="text"
                                placeholder={`Answer ${choiceIndex + 1}`}
                                value={choice}
                                onChange={(e) => {
                                    const newQuestions = [...questions]
                                    newQuestions[index].choices[choiceIndex] = e.target.value
                                    setQuestions(newQuestions)
                                }}
                                className="ml-2"
                            />

                        </div>
                    ))}
                </div>
            ))}

            {questions.length > 0 && (
                <div className="flex justify-center py-10">
                    <button
                        onClick={createTest}
                        className="w-full md:w-auto bg-slate-900 text-white text-lg font-bold rounded-xl px-12 py-4 hover:bg-slate-800 transition-all shadow-md hover:shadow-lg">
                        Create Test
                    </button>
                </div>
            )}

        </div>
    )
}